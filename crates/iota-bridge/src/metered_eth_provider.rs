// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::{fmt::Debug, sync::Arc};

use ethers::providers::{Http, HttpClientError, JsonRpcClient, Provider};
use serde::{Serialize, de::DeserializeOwned};
use url::{ParseError, Url};

use crate::metrics::BridgeMetrics;

#[derive(Debug, Clone)]
pub struct MeteredEthHttpProvider {
    inner: Http,
    metrics: Arc<BridgeMetrics>,
}

#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
#[cfg_attr(not(target_arch = "wasm32"), async_trait::async_trait)]
impl JsonRpcClient for MeteredEthHttpProvider {
    type Error = HttpClientError;

    async fn request<T: Serialize + Send + Sync + Debug, R: DeserializeOwned + Send>(
        &self,
        method: &str,
        params: T,
    ) -> Result<R, HttpClientError> {
        self.metrics
            .eth_rpc_queries
            .with_label_values(&[method])
            .inc();
        let _guard = self
            .metrics
            .eth_rpc_queries_latency
            .with_label_values(&[method])
            .start_timer();
        self.inner.request(method, params).await
    }
}

impl MeteredEthHttpProvider {
    pub fn new(url: impl Into<Url>, metrics: Arc<BridgeMetrics>) -> Self {
        let inner = Http::new(url);
        Self { inner, metrics }
    }
}

pub fn new_metered_eth_provider(
    url: &str,
    metrics: Arc<BridgeMetrics>,
) -> Result<Provider<MeteredEthHttpProvider>, ParseError> {
    let http_provider = MeteredEthHttpProvider::new(Url::parse(url)?, metrics);
    Ok(Provider::new(http_provider))
}

#[cfg(test)]
mod tests {
    use ethers::providers::Middleware;
    use prometheus::Registry;

    use super::*;

    #[tokio::test]
    #[ignore = "https://github.com/iotaledger/iota/issues/3224"]
    async fn test_metered_eth_provider() {
        let metrics = Arc::new(BridgeMetrics::new(&Registry::new()));
        let provider = new_metered_eth_provider("http://localhost:9876", metrics.clone()).unwrap();

        assert_eq!(
            metrics
                .eth_rpc_queries
                .get_metric_with_label_values(&["eth_blockNumber"])
                .unwrap()
                .get(),
            0
        );
        assert_eq!(
            metrics
                .eth_rpc_queries_latency
                .get_metric_with_label_values(&["eth_blockNumber"])
                .unwrap()
                .get_sample_count(),
            0
        );

        provider.get_block_number().await.unwrap_err(); // the rpc cal will fail but we don't care

        assert_eq!(
            metrics
                .eth_rpc_queries
                .get_metric_with_label_values(&["eth_blockNumber"])
                .unwrap()
                .get(),
            1
        );
        assert_eq!(
            metrics
                .eth_rpc_queries_latency
                .get_metric_with_label_values(&["eth_blockNumber"])
                .unwrap()
                .get_sample_count(),
            1
        );
    }
}
