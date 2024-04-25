// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

//! Error types pertaining to deserializing Stardust snapshots
use std::convert::Infallible;

use packable::error::UnknownTagError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StardustError {
    #[error("unsupported snapshot version: expected {0}, got {1}")]
    UnsupportedSnapshotVersion(u8, u8),
    #[error("invalid snapshot kind: {0}")]
    InvalidSnapshotKind(u8),
    #[error("block error: {0}")]
    BlockError(#[from] iota_sdk::types::block::Error),
    #[error("{0}")]
    UnknownTag(#[from] UnknownTagError<u8>),
}

impl From<Infallible> for StardustError {
    fn from(_: Infallible) -> Self {
        unreachable!()
    }
}
