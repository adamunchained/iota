// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { useIOTAClient } from '@iota/dapp-kit';
import type { DelegatedStake } from '@iota/iota.js/client';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type UseGetDelegatedStakesOptions = {
	address: string;
} & Omit<UseQueryOptions<DelegatedStake[], Error>, 'queryKey' | 'queryFn'>;

export function useGetDelegatedStake(options: UseGetDelegatedStakesOptions) {
	const client = useIOTAClient();
	const { address, ...queryOptions } = options;

	return useQuery({
		queryKey: ['delegated-stakes', address],
		queryFn: () => client.getStakes({ owner: address }),
		...queryOptions,
	});
}
