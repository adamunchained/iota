// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use iota_sdk::types::block::address::Address;
use iota_types::{base_types::IOTAAddress, object::Owner};

/// Converts a ["Stardust" `Address`](Address) to a [`IOTAAddress`].
///
/// This is intended as the only conversion function to go from Stardust to IOTA
/// addresses, so there is only one place to potentially update it if we decide
/// to change it later.
pub fn stardust_to_iota_address(stardust_address: impl Into<Address>) -> anyhow::Result<IOTAAddress> {
    stardust_address.into().to_string().parse()
}

/// Converts a ["Stardust" `Address`](Address) to a [`IOTAAddress`] and then
/// wraps it into an [`Owner`] which is either address- or object-owned
/// depending on the stardust address.
pub fn stardust_to_iota_address_owner(
    stardust_address: impl Into<Address>,
) -> anyhow::Result<Owner> {
    stardust_to_iota_address(stardust_address.into()).map(Owner::AddressOwner)
}
