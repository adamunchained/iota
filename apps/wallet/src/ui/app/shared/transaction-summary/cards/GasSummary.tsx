// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { useFormatCoin, type GasSummaryType } from '@iota/core';
import { formatAddress, IOTA_TYPE_ARG } from '@iota/iota-sdk/utils';

import { KeyValueInfo } from '@iota/apps-ui-kit';
import { useActiveAddress } from '_src/ui/app/hooks';
import { ExplorerLink, ExplorerLinkType } from '_src/ui/app/components';

interface GasSummaryProps {
    sender?: string | null;
    gasSummary?: GasSummaryType;
    isPending?: boolean;
    isError?: boolean;
}

export function GasSummary({ sender, gasSummary, isPending, isError }: GasSummaryProps) {
    const activeAddress = useActiveAddress();
    const address = sender || activeAddress;
    const [gas, symbol] = useFormatCoin(gasSummary?.totalGas, IOTA_TYPE_ARG);

    const gasValueText = isPending
        ? 'Estimating...'
        : isError
          ? 'Gas estimation failed'
          : `${gasSummary?.isSponsored ? 0 : gas}`;

    if (!gasSummary)
        return <KeyValueInfo keyText="Gas fee" value="0" supportingLabel={symbol} fullwidth />;

    return (
        <>
            {address === gasSummary?.owner && (
                <KeyValueInfo
                    keyText="Gas fee"
                    value={gasValueText}
                    supportingLabel={symbol}
                    fullwidth
                />
            )}
            {gasSummary?.isSponsored && gasSummary.owner && (
                <>
                    <KeyValueInfo
                        keyText="Sponsored fee"
                        value={gas}
                        supportingLabel={symbol}
                        fullwidth
                    />
                    <KeyValueInfo
                        keyText="Sponsor"
                        value={
                            <ExplorerLink
                                type={ExplorerLinkType.Address}
                                address={gasSummary.owner}
                            >
                                {formatAddress(gasSummary.owner)}
                            </ExplorerLink>
                        }
                        fullwidth
                    />
                </>
            )}
        </>
    );
}
