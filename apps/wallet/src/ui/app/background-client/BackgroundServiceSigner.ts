// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { type SerializedUIAccount } from '_src/background/accounts/Account';
import { type IOTAClient } from '@iota/iota.js/client';
import type { SerializedSignature } from '@iota/iota.js/cryptography';

import type { BackgroundClient } from '.';
import { WalletSigner } from '../WalletSigner';

export class BackgroundServiceSigner extends WalletSigner {
    readonly #account: SerializedUIAccount;
    readonly #backgroundClient: BackgroundClient;

    constructor(
        account: SerializedUIAccount,
        backgroundClient: BackgroundClient,
        client: IOTAClient,
    ) {
        super(client);
        this.#account = account;
        this.#backgroundClient = backgroundClient;
    }

    async getAddress(): Promise<string> {
        return this.#account.address;
    }

    signData(data: Uint8Array): Promise<SerializedSignature> {
        return this.#backgroundClient.signData(this.#account.id, data);
    }

    connect(client: IOTAClient) {
        return new BackgroundServiceSigner(this.#account, this.#backgroundClient, client);
    }
}
