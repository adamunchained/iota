// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

module a::test {
    use iota::object::UID;
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};

    #[allow(unused_field)]
    struct S1 has key, store {
        id: UID
    }

    #[allow(lint(self_transfer))]
    public fun custom_transfer_bad(o: S1, ctx: &TxContext) {
        transfer::transfer(o, tx_context::sender(ctx))
    }

    #[allow(lint(share_owned))]
    public fun custom_share_bad(o: S1) {
        transfer::share_object(o)
    }

    public fun custom_freeze_bad(o: S1) {
        transfer::freeze_object(o)
    }
}

module iota::object {
    struct UID has store {
        id: address,
    }
    public fun new(_: &mut iota::tx_context::TxContext): UID {
        abort 0
    }
}

module iota::tx_context {
    struct TxContext has drop {}
    public fun sender(_: &TxContext): address {
        @0
    }
}

module iota::transfer {
    public fun transfer<T: key>(_: T, _: address) {
        abort 0
    }

    public fun freeze_object<T: key>(_: T) {
        abort 0
    }

    public fun share_object<T: key>(_: T) {
        abort 0
    }
}
