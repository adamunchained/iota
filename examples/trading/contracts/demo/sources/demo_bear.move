// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

module demo::demo_bear {
    use std::string::{String, utf8};

    use iota::object::{Self, UID};
    use iota::tx_context::{TxContext, sender};
    use iota::package;
    use iota::display;

    /// our demo struct.
    struct DemoBear has key, store {
        id: UID,
        name: String
    }

    /// our OTW to create display.
    struct DEMO_BEAR has drop {}

    // It's recommened to create Display using PTBs instead of 
    // directly on the contracts.
    // We are only creating it here for demo purposes (one-step setup).
    fun init(otw: DEMO_BEAR, ctx: &mut TxContext){
        let publisher = package::claim(otw, ctx);
         let keys = vector[
            utf8(b"name"),
            utf8(b"image_url"),
            utf8(b"description"),
        ];


        let values = vector[
            // Let's add a demo name for our `DemoBear`
            utf8(b"{name}"),
            // Adding a happy bear image.
            utf8(b"https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9sYXIlMjBiZWFyfGVufDB8fDB8fHww"),
            // Description is static for all bears out there.
            utf8(b"The greatest figure for demos"),
        ];

        // Get a new `Display` object for the `Hero` type.
        let display = display::new_with_fields<DemoBear>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        iota::transfer::public_transfer(display, sender(ctx));
        iota::transfer::public_transfer(publisher, sender(ctx))
    }

    public fun new(name: String, ctx: &mut TxContext): DemoBear {
        DemoBear {
            id: object::new(ctx),
            name: name
        }
    }
}
