// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { type DelegatedStake } from '@iota/iota.js/client';

// Get staked IOTA
export const getAllStakeIOTA = (allDelegation: DelegatedStake[]) => {
    return (
        allDelegation.reduce(
            (acc, curr) =>
                curr.stakes.reduce((total, { principal }) => total + BigInt(principal), acc),
            0n,
        ) || 0n
    );
};
