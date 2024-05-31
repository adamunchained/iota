// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

/// Coin<IOTA> is the token used to pay for gas in IOTA.
/// It has 9 decimals, and the smallest unit (10^-9) is called "micros".
module iota::iota {
    use iota::balance::Balance;
    use iota::coin;

    const EAlreadyMinted: u64 = 0;
    /// Sender is not @0x0 the system address.
    const ENotSystemAddress: u64 = 1;

    #[allow(unused_const)]
    /// The amount of Micros per IOTA token based on the fact that micros is
    /// 10^-9 of a IOTA token
    const MICROS_PER_IOTA: u64 = 1_000_000_000;

    #[allow(unused_const)]
    /// The total supply of IOTA denominated in whole IOTA tokens (10 Billion)
    const TOTAL_SUPPLY_IOTA: u64 = 10_000_000_000;

    /// The total supply of IOTA denominated in Micros (10 Billion * 10^9)
    const TOTAL_SUPPLY_MICROS: u64 = 10_000_000_000_000_000_000;

    /// Name of the coin
    public struct IOTA has drop {}

    #[allow(unused_function)]
    /// Register the `IOTA` Coin to acquire its `Supply`.
    /// This should be called only once during genesis creation.
    fun new(ctx: &mut TxContext): Balance<IOTA> {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        assert!(ctx.epoch() == 0, EAlreadyMinted);

        let (treasury, metadata) = coin::create_currency(
            IOTA {},
            9,
            b"IOTA",
            b"IOTA",
            // TODO: add appropriate description and logo url
            b"",
            option::none(),
            ctx
        );
        transfer::public_freeze_object(metadata);
        let mut supply = treasury.treasury_into_supply();
        let total_iota = supply.increase_supply(TOTAL_SUPPLY_MICROS);
        supply.destroy_supply();
        total_iota
    }

    public entry fun transfer(c: coin::Coin<IOTA>, recipient: address) {
        transfer::public_transfer(c, recipient)
    }
}
