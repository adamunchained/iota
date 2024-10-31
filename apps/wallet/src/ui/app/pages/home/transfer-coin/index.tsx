// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { Overlay } from '_components';
import { ampli } from '_src/shared/analytics/ampli';
import { getSignerOperationErrorMessage } from '_src/ui/app/helpers/errorMessages';
import { useActiveAccount } from '_src/ui/app/hooks/useActiveAccount';
import { useSigner } from '_src/ui/app/hooks/useSigner';
import { useUnlockedGuard } from '_src/ui/app/hooks/useUnlockedGuard';
import {
    COINS_QUERY_REFETCH_INTERVAL,
    COINS_QUERY_STALE_TIME,
    CoinSelector,
    createTokenTransferTransaction,
    filterAndSortTokenBalances,
    useCoinMetadata,
} from '@iota/core';
// import * as Sentry from '@sentry/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { PreviewTransfer } from './PreviewTransfer';
import { SendTokenForm, type SubmitProps } from './SendTokenForm';
import { Button, ButtonType, LoadingIndicator } from '@iota/apps-ui-kit';
import { Loader } from '@iota/ui-icons';
import { useIotaClientQuery } from 'node_modules/@iota/dapp-kit/src';

function TransferCoinPage() {
    const [searchParams] = useSearchParams();
    const coinType = searchParams.get('type');
    const [showTransactionPreview, setShowTransactionPreview] = useState<boolean>(false);
    const [formData, setFormData] = useState<SubmitProps>();
    const navigate = useNavigate();
    const { data: coinMetadata } = useCoinMetadata(coinType);
    const activeAccount = useActiveAccount();
    const signer = useSigner(activeAccount);
    const address = activeAccount?.address;
    const queryClient = useQueryClient();

    const { data: coinsBalance, isPending: coinsBalanceIsPending } = useIotaClientQuery(
        'getAllBalances',
        { owner: address! },
        {
            enabled: !!address,
            refetchInterval: COINS_QUERY_REFETCH_INTERVAL,
            staleTime: COINS_QUERY_STALE_TIME,
            select: filterAndSortTokenBalances,
        },
    );

    if (coinsBalanceIsPending) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoadingIndicator />
            </div>
        );
    }

    const transaction = useMemo(() => {
        if (!coinType || !signer || !formData || !address) return null;

        return createTokenTransferTransaction({
            coinType,
            coinDecimals: coinMetadata?.decimals ?? 0,
            ...formData,
        });
    }, [formData, signer, coinType, address, coinMetadata?.decimals]);

    const executeTransfer = useMutation({
        mutationFn: async () => {
            if (!transaction || !signer) {
                throw new Error('Missing data');
            }

            // const sentryTransaction = Sentry.startTransaction({
            // 	name: 'send-tokens',
            // });
            return signer.signAndExecuteTransaction({
                transactionBlock: transaction,
                options: {
                    showInput: true,
                    showEffects: true,
                    showEvents: true,
                },
            });

            // finally {
            // sentryTransaction.finish();
            // }
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['get-coins'] });
            queryClient.invalidateQueries({ queryKey: ['coin-balance'] });

            ampli.sentCoins({
                coinType: coinType!,
            });

            const receiptUrl = `/receipt?txdigest=${encodeURIComponent(
                response.digest,
            )}&from=transactions`;
            return navigate(receiptUrl);
        },
        onError: (error) => {
            toast.error(
                <div className="flex max-w-xs flex-col overflow-hidden">
                    <small className="overflow-hidden text-ellipsis">
                        {getSignerOperationErrorMessage(error)}
                    </small>
                </div>,
                {
                    duration: 10000,
                },
            );
        },
    });

    if (useUnlockedGuard()) {
        return null;
    }

    if (!coinType || !coinsBalance) {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <Overlay
            showModal={true}
            title={showTransactionPreview ? 'Review & Send' : 'Send'}
            closeOverlay={() => navigate('/')}
            showBackButton
            onBack={showTransactionPreview ? () => setShowTransactionPreview(false) : undefined}
        >
            <div className="flex h-full w-full flex-col gap-md">
                {showTransactionPreview && formData ? (
                    <div className="flex h-full flex-col">
                        <div className="h-full flex-1">
                            <PreviewTransfer
                                coinType={coinType}
                                amount={formData.amount}
                                to={formData.to}
                                approximation={formData.isPayAllIota}
                                gasBudget={formData.gasBudgetEst}
                            />
                        </div>
                        <Button
                            type={ButtonType.Primary}
                            onClick={() => {
                                setFormData(formData);
                                executeTransfer.mutateAsync();
                            }}
                            text="Send Now"
                            disabled={coinType === null || executeTransfer.isPending}
                            icon={
                                executeTransfer.isPending ? (
                                    <Loader className="animate-spin" />
                                ) : undefined
                            }
                            iconAfterText
                        />
                    </div>
                ) : (
                    <>
                        <CoinSelector
                            activeCoinType={coinType}
                            coins={coinsBalance || []}
                            onClick={(coinType) => {
                                setFormData(undefined)
                                navigate(`/send?${new URLSearchParams({ type: coinType }).toString()}`);
                            }}
                        />

                        <SendTokenForm
                            onSubmit={(formData) => {
                                setFormData(formData);
                                setShowTransactionPreview(true);
                            }}
                            key={coinType}
                            coinType={coinType}
                            initialAmount={formData?.amount || ''}
                            initialTo={formData?.to || ''}
                        />
                    </>
                )}
            </div>
        </Overlay>
    );
}

export default TransferCoinPage;
