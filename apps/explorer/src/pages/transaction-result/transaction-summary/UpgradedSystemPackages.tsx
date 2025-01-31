// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { CollapsibleCard, ObjectLink } from '~/components/ui';
import { Accordion, AccordionContent, AccordionHeader, Title, TitleSize } from '@iota/apps-ui-kit';

import type { OwnedObjectRef } from '@iota/iota-sdk/client';

export function UpgradedSystemPackages({ data }: { data: OwnedObjectRef[] }): JSX.Element | null {
    const [isExpanded, setIsExpanded] = useState(true);
    if (!data?.length) return null;

    return (
        <CollapsibleCard title="Changes">
            <div className="px-md--rs pb-lg pt-xs">
                <Accordion>
                    <AccordionHeader
                        isExpanded={isExpanded}
                        onToggle={() => setIsExpanded(!isExpanded)}
                    >
                        <Title size={TitleSize.Small} title="Updated" />
                    </AccordionHeader>
                    <AccordionContent isExpanded={isExpanded}>
                        <div className="flex flex-col gap-2">
                            {data.map((object) => {
                                const { objectId } = object.reference;
                                return (
                                    <div
                                        className="flex flex-wrap items-center justify-between"
                                        key={objectId}
                                    >
                                        <div className="flex items-center gap-0.5">
                                            <span className="text-body-md text-neutral-40">
                                                Package
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <ObjectLink objectId={objectId} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </Accordion>
            </div>
        </CollapsibleCard>
    );
}
