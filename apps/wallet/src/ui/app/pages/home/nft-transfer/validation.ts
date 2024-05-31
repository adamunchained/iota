// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { createIOTAAddressValidation } from '_components/address-input/validation';
import { type IOTAClient } from '@iota/iota.js/client';
import * as Yup from 'yup';

export function createValidationSchema(
    client: IOTAClient,
    iotaNSEnabled: boolean,
    senderAddress: string,
    objectId: string,
) {
    return Yup.object({
        to: createIOTAAddressValidation(client, iotaNSEnabled)
            .test(
                'sender-address',
                // eslint-disable-next-line no-template-curly-in-string
                `NFT is owned by this address`,
                (value) => senderAddress !== value,
            )
            .test(
                'nft-sender-address',
                // eslint-disable-next-line no-template-curly-in-string
                `NFT address must be different from receiver address`,
                (value) => objectId !== value,
            ),
    });
}
