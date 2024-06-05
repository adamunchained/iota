// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::collections::HashMap;

use anyhow::{anyhow, ensure, Result};
use iota_sdk::types::block::output::{BasicOutput, OutputId, TokenId};
use sui_types::{
    balance::Balance, coin::Coin, dynamic_field::Field, in_memory_storage::InMemoryStorage,
    timelock::timelock::TimeLock, TypeTag,
};

use crate::stardust::{
    migration::{
        executor::FoundryLedgerData,
        verification::{
            created_objects::CreatedObjects,
            util::{
                verify_expiration_unlock_condition, verify_metadata_feature, verify_native_tokens,
                verify_parent, verify_sender_feature, verify_storage_deposit_unlock_condition,
                verify_tag_feature, verify_timelock_unlock_condition,
            },
        },
    },
    types::timelock::is_timelocked_vested_reward,
};

pub(super) fn verify_basic_output(
    output_id: OutputId,
    output: &BasicOutput,
    created_objects: &CreatedObjects,
    foundry_data: &HashMap<TokenId, FoundryLedgerData>,
    target_milestone_timestamp: u32,
    storage: &InMemoryStorage,
) -> Result<()> {
    // If this is a timelocked vested reward, a `Timelock<Balance>` is created.
    if is_timelocked_vested_reward(output_id, output, target_milestone_timestamp) {
        let created_timelock = created_objects
            .output()
            .and_then(|id| {
                storage
                    .get_object(id)
                    .ok_or_else(|| anyhow!("missing timelock object"))
            })?
            .to_rust::<TimeLock<Balance>>()
            .ok_or_else(|| anyhow!("invalid timelock object"))?;

        // Locked timestamp
        ensure!(
            created_timelock.expiration_timestamp_ms == target_milestone_timestamp as u64,
            "timelock timestamp mismatch: found {}, expected {}",
            created_timelock.expiration_timestamp_ms,
            target_milestone_timestamp
        );

        // Amount
        ensure!(
            created_timelock.locked.value() == output.amount(),
            "locked amount mismatch: found {}, expected {}",
            created_timelock.locked.value(),
            output.amount()
        );

        return Ok(());
    }

    // If the output has multiple unlock conditions, then a genesis object should
    // have been created.
    if output.unlock_conditions().len() > 1 {
        let created_output = created_objects
            .output()
            .and_then(|id| {
                storage
                    .get_object(id)
                    .ok_or_else(|| anyhow!("missing basic output object"))
            })?
            .to_rust::<crate::stardust::types::output::BasicOutput>()
            .ok_or_else(|| anyhow!("invalid basic output object"))?;

        // Amount
        ensure!(
            created_output.iota.value() == output.amount(),
            "amount mismatch: found {}, expected {}",
            created_output.iota.value(),
            output.amount()
        );

        // Native Tokens
        verify_native_tokens::<Field<String, Balance>>(
            output.native_tokens(),
            foundry_data,
            created_output.native_tokens,
            created_objects.native_tokens().ok(),
            storage,
        )?;

        // Storage Deposit Return Unlock Condition
        verify_storage_deposit_unlock_condition(
            output.unlock_conditions().storage_deposit_return(),
            created_output.storage_deposit_return.as_ref(),
        )?;

        // Timelock Unlock Condition
        verify_timelock_unlock_condition(
            output.unlock_conditions().timelock(),
            created_output.timelock.as_ref(),
        )?;

        // Expiration Unlock Condition
        verify_expiration_unlock_condition(
            output.unlock_conditions().expiration(),
            created_output.expiration.as_ref(),
            output.address(),
        )?;

        // Metadata Feature
        verify_metadata_feature(
            output.features().metadata(),
            created_output.metadata.as_ref(),
        )?;

        // Tag Feature
        verify_tag_feature(output.features().tag(), created_output.tag.as_ref())?;

        // Sender Feature
        verify_sender_feature(output.features().sender(), created_output.sender)?;

    // Otherwise the output contains only an address unlock condition and only a
    // coin and possibly native tokens should have been created.
    } else {
        ensure!(
            created_objects.output().is_err(),
            "unexpected output object created for simple deposit"
        );

        // Coin value.
        let created_coin = created_objects
            .coin()
            .and_then(|id| {
                storage
                    .get_object(id)
                    .ok_or_else(|| anyhow!("missing coin"))
            })?
            .as_coin_maybe()
            .ok_or_else(|| anyhow!("expected a coin"))?;
        ensure!(
            created_coin.value() == output.amount(),
            "coin amount mismatch: found {}, expected {}",
            created_coin.value(),
            output.amount()
        );

        // Native Tokens
        verify_native_tokens::<(TypeTag, Coin)>(
            output.native_tokens(),
            foundry_data,
            None,
            created_objects.native_tokens().ok(),
            storage,
        )?;
    }

    ensure!(
        created_objects.package().is_err(),
        "unexpected package found"
    );

    verify_parent(output.address(), storage)?;

    Ok(())
}
