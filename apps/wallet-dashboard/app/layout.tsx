// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Inter } from 'next/font/google';

import './globals.css';

import { IOTAClientProvider, WalletProvider } from '@iota/dapp-kit';
import { getAllNetworks } from '@iota/iota.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import '@iota/dapp-kit/dist/index.css';
import { Popup, PopupProvider } from '@/components/Popup';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = React.useState(() => new QueryClient());

    const allNetworks = getAllNetworks();

    return (
        <html lang="en">
            <body className={inter.className}>
                <PopupProvider>
                    <QueryClientProvider client={queryClient}>
                        <IOTAClientProvider networks={allNetworks} defaultNetwork="testnet">
                            <WalletProvider>{children}</WalletProvider>
                            <Popup />
                        </IOTAClientProvider>
                    </QueryClientProvider>
                </PopupProvider>
            </body>
        </html>
    );
}
