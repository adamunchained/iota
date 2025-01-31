// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::env;

use serde::{Deserialize, Serialize};

/// config as loaded from `config.yaml`.
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct IndexerConfig {
    pub remote_store_url: String,
    pub eth_rpc_url: String,
    #[serde(default = "default_db_url")]
    pub db_url: String,
    pub eth_ws_url: String,
    pub checkpoints_path: String,
    pub concurrency: u64,
    pub bridge_genesis_checkpoint: u64,
    pub eth_iota_bridge_contract_address: String,
    pub start_block: u64,
    pub metric_url: String,
    pub metric_port: u16,
    pub iota_rpc_url: Option<String>,
    pub back_fill_lot_size: u64,
    pub resume_from_checkpoint: Option<u64>,
}

impl iota_config::Config for IndexerConfig {}

pub fn default_db_url() -> String {
    env::var("DB_URL").expect("db_url must be set in config or via the $DB_URL env var")
}
