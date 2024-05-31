// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { isIOTANSName } from '@iota/core';
import { formatAddress, formatDigest } from '@iota/iota.js/utils';
import { type ReactNode } from 'react';

import { Link, type LinkProps } from '~/ui/Link';

interface BaseInternalLinkProps extends LinkProps {
    noTruncate?: boolean;
    label?: string | ReactNode;
    queryStrings?: Record<string, string>;
}

function createInternalLink<T extends string>(
    base: string,
    propName: T,
    formatter: (id: string) => string = (id) => id,
) {
    return ({
        [propName]: id,
        noTruncate,
        label,
        queryStrings = {},
        ...props
    }: BaseInternalLinkProps & Record<T, string>) => {
        const truncatedAddress = noTruncate ? id : formatter(id);
        const queryString = new URLSearchParams(queryStrings).toString();
        const queryStringPrefix = queryString ? `?${queryString}` : '';

        return (
            <Link variant="mono" to={`/${base}/${encodeURI(id)}${queryStringPrefix}`} {...props}>
                {label || truncatedAddress}
            </Link>
        );
    };
}

export const EpochLink = createInternalLink('epoch', 'epoch');
export const CheckpointLink = createInternalLink('checkpoint', 'digest', formatAddress);
export const CheckpointSequenceLink = createInternalLink('checkpoint', 'sequence');
export const AddressLink = createInternalLink('address', 'address', (addressOrNs) => {
    if (isIOTANSName(addressOrNs)) {
        return addressOrNs;
    }
    return formatAddress(addressOrNs);
});
export const ObjectLink = createInternalLink('object', 'objectId', formatAddress);
export const TransactionLink = createInternalLink('txblock', 'digest', formatDigest);
export const ValidatorLink = createInternalLink('validator', 'address', formatAddress);
