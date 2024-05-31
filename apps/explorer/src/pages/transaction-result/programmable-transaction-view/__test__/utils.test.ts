// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { flattenIOTAArguments } from '~/pages/transaction-result/programmable-transaction-view/utils';

describe('utils.ts', () => {
    describe('flattenCommandData', () => {
        it('should format SplitCoin data', () => {
            expect(flattenIOTAArguments(['GasCoin', { Input: 1 }])).toEqual('GasCoin, Input(1)');
            expect(flattenIOTAArguments(['GasCoin', { Result: 2 }])).toEqual('GasCoin, Result(2)');
            expect(flattenIOTAArguments(['GasCoin', { NestedResult: [1, 2] }])).toEqual(
                'GasCoin, NestedResult(1, 2)',
            );
        });
        it('should format TransferObjects data', () => {
            expect(
                flattenIOTAArguments([
                    [
                        {
                            Result: 0,
                        },
                        {
                            Result: 1,
                        },
                        {
                            Result: 2,
                        },
                        {
                            Result: 3,
                        },
                        {
                            Result: 4,
                        },
                    ],
                    {
                        Input: 0,
                    },
                ]),
            ).toEqual('[Result(0), Result(1), Result(2), Result(3), Result(4)], Input(0)');
        });
        it('should flatten MergeCoinsIOTATransaction data', () => {
            expect(
                flattenIOTAArguments([
                    {
                        Input: 0,
                    },
                    [
                        {
                            Result: 0,
                        },
                        {
                            Result: 1,
                        },
                        {
                            Result: 2,
                        },
                        {
                            Result: 3,
                        },
                        {
                            Result: 4,
                        },
                    ],
                ]),
            ).toEqual('Input(0), [Result(0), Result(1), Result(2), Result(3), Result(4)]');
        });
    });
});
