// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use crate::messages_checkpoint::CheckpointSequenceNumber;
use crate::{committee::EpochId, crypto::AuthorityStrongQuorumSignInfo};

use crate::message_envelope::{Envelope, TrustedEnvelope, VerifiedEnvelope};
use crate::transaction::SenderSignedData;
use serde::{Deserialize, Serialize};

/// CertificateProof is a proof that a transaction certs existed at a given epoch and hence can be executed.
/// There are two types of proofs: one that is proven by inclusion in a checkpoint and one that is proven by quorum signature.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum CertificateProof {
    /// Validity was proven by inclusion in the given checkpoint
    Checkpoint(EpochId, CheckpointSequenceNumber),
    /// Validity was proven by transaction certificate signature
    Certified(AuthorityStrongQuorumSignInfo),
    /// At least f+1 validators have executed this transaction.
    /// In practice, we will always get 2f+1 (effects cert), but theoretically f+1 is enough to prove
    /// that the transaction is valid.
    QuorumExecuted(EpochId),
    /// Transaction generated by the system, for example Clock update transaction
    SystemTransaction(EpochId),
}

impl CertificateProof {
    pub fn new_from_cert_sig(sig: AuthorityStrongQuorumSignInfo) -> Self {
        Self::Certified(sig)
    }

    pub fn new_from_checkpoint(epoch: EpochId, checkpoint: CheckpointSequenceNumber) -> Self {
        Self::Checkpoint(epoch, checkpoint)
    }

    pub fn new_system(epoch: EpochId) -> Self {
        Self::SystemTransaction(epoch)
    }

    pub fn epoch(&self) -> EpochId {
        match self {
            Self::Checkpoint(epoch, _)
            | Self::QuorumExecuted(epoch)
            | Self::SystemTransaction(epoch) => *epoch,
            Self::Certified(sig) => sig.epoch,
        }
    }
}

/// An ExecutableTransaction is a wrapper of a transaction with a CertificateProof that indicates
/// there existed a valid certificate for this transaction, and hence it can be executed locally.
/// This is an abstraction data structure to cover both the case where the transaction is
/// certified or checkpointed when we schedule it for execution.
pub type ExecutableTransaction = Envelope<SenderSignedData, CertificateProof>;
pub type VerifiedExecutableTransaction = VerifiedEnvelope<SenderSignedData, CertificateProof>;
pub type TrustedExecutableTransaction = TrustedEnvelope<SenderSignedData, CertificateProof>;

impl VerifiedExecutableTransaction {
    pub fn certificate_sig(&self) -> Option<&AuthorityStrongQuorumSignInfo> {
        match self.auth_sig() {
            CertificateProof::Certified(sig) => Some(sig),
            _ => None,
        }
    }
}
