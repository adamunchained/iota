// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { IOTAClientProvider, WalletProvider } from '@iota/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import '@iota/dapp-kit/dist/index.css';
import './index.css';

import { getFullnodeUrl } from '@iota/iota.js/client';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<IOTAClientProvider
				defaultNetwork="testnet"
				networks={{ testnet: { url: getFullnodeUrl('testnet') } }}
			>
				<WalletProvider enableUnsafeBurner>
					<App />
				</WalletProvider>
			</IOTAClientProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
