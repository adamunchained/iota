// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { useCoinMetadata } from '@iota/core';
import { IOTA, Unstaked } from '@iota/icons';
import { IOTA_TYPE_ARG } from '@iota/iota.js/utils';
import { cva, type VariantProps } from 'class-variance-authority';

import { ImageIcon } from '~/ui/ImageIcon';

const imageStyle = cva(['flex rounded-2xl'], {
    variants: {
        size: {
            sm: 'w-6 h-6',
            md: 'w-7.5 h-7.5',
            lg: 'md:w-10 md:h-10 w-8 h-8',
            xl: 'md:w-31.5 md:h-31.5 w-16 h-16 ',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

function IOTACoin() {
    return (
        <IOTA className="flex h-full w-full items-center justify-center rounded-2xl bg-iota p-1.5 text-body text-white" />
    );
}

type NonIOTACoinProps = {
    coinType: string;
};

function NonIOTACoin({ coinType }: NonIOTACoinProps) {
    const { data: coinMeta } = useCoinMetadata(coinType);
    return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-40 text-hero-darkest text-opacity-30">
            {coinMeta?.iconUrl ? (
                <ImageIcon
                    size="sm"
                    src={coinMeta.iconUrl}
                    label={coinMeta.name || coinType}
                    fallback={coinMeta.name || coinType}
                    circle
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-hero-darkest border-opacity-10">
                    <Unstaked className="h-2.5 w-2.5" />
                </div>
            )}
        </div>
    );
}

export interface CoinIconProps extends VariantProps<typeof imageStyle> {
    coinType: string;
}

export function CoinIcon({ coinType, ...styleProps }: CoinIconProps) {
    return (
        <div className={imageStyle(styleProps)}>
            {coinType === IOTA_TYPE_ARG ? <IOTACoin /> : <NonIOTACoin coinType={coinType} />}
        </div>
    );
}
