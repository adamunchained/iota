// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { useIOTAClient } from '@iota/dapp-kit';
import { useQuery } from '@tanstack/react-query';

export function useGetTransaction(transactionId: string) {
    const client = useIOTAClient();
    return useQuery({
        queryKey: ['transactions-by-id', transactionId],
        queryFn: async () =>
            client.getTransactionBlock({
                digest: transactionId,
                options: {
                    showInput: true,
                    showEffects: true,
                    showEvents: true,
                    showBalanceChanges: true,
                    showObjectChanges: true,
                },
            }),
        enabled: !!transactionId,
    });
}
