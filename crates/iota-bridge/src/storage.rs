// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::{collections::HashMap, path::Path, sync::Arc};

use iota_types::{event::EventID, Identifier};
use typed_store::{
    rocks::{DBMap, MetricConf},
    traits::{TableSummary, TypedStoreDebug},
    Map,
};
use typed_store_derive::DBMapUtils;

use crate::{
    error::{BridgeError, BridgeResult},
    types::{BridgeAction, BridgeActionDigest},
};

#[derive(DBMapUtils)]
pub struct BridgeOrchestratorTables {
    /// pending BridgeActions that orchestrator received but not yet executed
    pub(crate) pending_actions: DBMap<BridgeActionDigest, BridgeAction>,
    /// module identifier to the last processed EventID
    pub(crate) iota_syncer_cursors: DBMap<Identifier, EventID>,
    /// contract address to the last processed block
    pub(crate) eth_syncer_cursors: DBMap<alloy::primitives::Address, u64>,
}

// TODO remove after wireup
#[allow(dead_code)]
impl BridgeOrchestratorTables {
    pub fn new(path: &Path) -> Arc<Self> {
        Arc::new(Self::open_tables_read_write(
            path.to_path_buf(),
            MetricConf::new("bridge"),
            None,
            None,
        ))
    }

    pub(crate) fn insert_pending_actions(&self, actions: &[BridgeAction]) -> BridgeResult<()> {
        let mut batch = self.pending_actions.batch();
        batch
            .insert_batch(
                &self.pending_actions,
                actions.iter().map(|a| (a.digest(), a)),
            )
            .map_err(|e| {
                BridgeError::StorageError(format!("Couldn't insert into pending_actions: {:?}", e))
            })?;
        batch
            .write()
            .map_err(|e| BridgeError::StorageError(format!("Couldn't write batch: {:?}", e)))
    }

    pub(crate) fn remove_pending_actions(
        &self,
        actions: &[BridgeActionDigest],
    ) -> BridgeResult<()> {
        let mut batch = self.pending_actions.batch();
        batch
            .delete_batch(&self.pending_actions, actions)
            .map_err(|e| {
                BridgeError::StorageError(format!("Couldn't delete from pending_actions: {:?}", e))
            })?;
        batch
            .write()
            .map_err(|e| BridgeError::StorageError(format!("Couldn't write batch: {:?}", e)))
    }

    pub(crate) fn update_iota_event_cursor(
        &self,
        module: Identifier,
        cursor: EventID,
    ) -> BridgeResult<()> {
        let mut batch = self.iota_syncer_cursors.batch();

        batch
            .insert_batch(&self.iota_syncer_cursors, [(module, cursor)])
            .map_err(|e| {
                BridgeError::StorageError(format!(
                    "Couldn't insert into iota_syncer_cursors: {:?}",
                    e
                ))
            })?;
        batch
            .write()
            .map_err(|e| BridgeError::StorageError(format!("Couldn't write batch: {:?}", e)))
    }

    pub(crate) fn update_eth_event_cursor(
        &self,
        contract_address: alloy::primitives::Address,
        cursor: u64,
    ) -> BridgeResult<()> {
        let mut batch = self.eth_syncer_cursors.batch();

        batch
            .insert_batch(&self.eth_syncer_cursors, [(contract_address, cursor)])
            .map_err(|e| {
                BridgeError::StorageError(format!(
                    "Couldn't insert into eth_syncer_cursors: {:?}",
                    e
                ))
            })?;
        batch
            .write()
            .map_err(|e| BridgeError::StorageError(format!("Couldn't write batch: {:?}", e)))
    }

    pub fn get_all_pending_actions(
        &self,
    ) -> BridgeResult<HashMap<BridgeActionDigest, BridgeAction>> {
        Ok(self.pending_actions.unbounded_iter().collect())
    }

    pub fn get_iota_event_cursors(
        &self,
        identifiers: &[Identifier],
    ) -> BridgeResult<Vec<Option<EventID>>> {
        self.iota_syncer_cursors
            .multi_get(identifiers)
            .map_err(|e| {
                BridgeError::StorageError(format!("Couldn't get iota_syncer_cursors: {:?}", e))
            })
    }

    pub fn get_eth_event_cursors(
        &self,
        contract_addresses: &[alloy::primitives::Address],
    ) -> BridgeResult<Vec<Option<u64>>> {
        self.eth_syncer_cursors
            .multi_get(contract_addresses)
            .map_err(|e| {
                BridgeError::StorageError(format!("Couldn't get iota_syncer_cursors: {:?}", e))
            })
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use iota_types::digests::TransactionDigest;

    use super::*;
    use crate::test_utils::get_test_iota_to_eth_bridge_action;

    // async: existing runtime is required with typed-store
    #[tokio::test]
    async fn test_bridge_storage_basic() {
        let temp_dir = tempfile::tempdir().unwrap();
        let store = BridgeOrchestratorTables::new(temp_dir.path());

        let action1 = get_test_iota_to_eth_bridge_action(None, Some(0), Some(99), Some(10000));

        let action2 = get_test_iota_to_eth_bridge_action(None, Some(2), Some(100), Some(10000));

        // in the beginning it's empty
        let actions = store.get_all_pending_actions().unwrap();
        assert!(actions.is_empty());

        // remove non existing entry is ok
        store.remove_pending_actions(&[action1.digest()]).unwrap();

        store
            .insert_pending_actions(&vec![action1.clone(), action2.clone()])
            .unwrap();

        let actions = store.get_all_pending_actions().unwrap();
        assert_eq!(
            actions,
            HashMap::from_iter(vec![
                (action1.digest(), action1.clone()),
                (action2.digest(), action2.clone())
            ])
        );

        // insert an existing action is ok
        store.insert_pending_actions(&[action1.clone()]).unwrap();
        let actions = store.get_all_pending_actions().unwrap();
        assert_eq!(
            actions,
            HashMap::from_iter(vec![
                (action1.digest(), action1.clone()),
                (action2.digest(), action2.clone())
            ])
        );

        // remove action 2
        store.remove_pending_actions(&[action2.digest()]).unwrap();
        let actions = store.get_all_pending_actions().unwrap();
        assert_eq!(
            actions,
            HashMap::from_iter(vec![(action1.digest(), action1.clone())])
        );

        // remove action 1
        store.remove_pending_actions(&[action1.digest()]).unwrap();
        let actions = store.get_all_pending_actions().unwrap();
        assert!(actions.is_empty());

        // update eth event cursor
        let eth_contract_address = alloy::primitives::Address::new(rand::random());
        let eth_block_num = 199999u64;
        assert!(
            store
                .get_eth_event_cursors(&[eth_contract_address])
                .unwrap()[0]
                .is_none()
        );
        store
            .update_eth_event_cursor(eth_contract_address, eth_block_num)
            .unwrap();
        assert_eq!(
            store
                .get_eth_event_cursors(&[eth_contract_address])
                .unwrap()[0]
                .unwrap(),
            eth_block_num
        );

        // update iota event cursor
        let iota_module = Identifier::from_str("test").unwrap();
        let iota_cursor = EventID {
            tx_digest: TransactionDigest::random(),
            event_seq: 1,
        };
        assert!(
            store
                .get_iota_event_cursors(&[iota_module.clone()])
                .unwrap()[0]
                .is_none()
        );
        store
            .update_iota_event_cursor(iota_module.clone(), iota_cursor)
            .unwrap();
        assert_eq!(
            store
                .get_iota_event_cursors(&[iota_module.clone()])
                .unwrap()[0]
                .unwrap(),
            iota_cursor
        );
    }
}
