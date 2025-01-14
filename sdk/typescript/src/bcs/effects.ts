// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@iota/bcs';

import { Address, ObjectDigest } from './bcs.js';

const PackageUpgradeError = bcs.enum('PackageUpgradeError', {
    UnableToFetchPackage: bcs.struct('UnableToFetchPackage', { packageId: Address }),
    NotAPackage: bcs.struct('NotAPackage', { objectId: Address }),
    IncompatibleUpgrade: null,
    DigestDoesNotMatch: bcs.struct('DigestDoesNotMatch', { digest: bcs.vector(bcs.u8()) }),
    UnknownUpgradePolicy: bcs.struct('UnknownUpgradePolicy', { policy: bcs.u8() }),
    PackageIDDoesNotMatch: bcs.struct('PackageIDDoesNotMatch', {
        packageId: Address,
        ticketId: Address,
    }),
});

const ModuleId = bcs.struct('ModuleId', {
    address: Address,
    name: bcs.string(),
});
const MoveLocation = bcs.struct('MoveLocation', {
    module: ModuleId,
    function: bcs.u16(),
    instruction: bcs.u16(),
    functionName: bcs.option(bcs.string()),
});

const CommandArgumentError = bcs.enum('CommandArgumentError', {
    TypeMismatch: null,
    InvalidBCSBytes: null,
    InvalidUsageOfPureArg: null,
    InvalidArgumentToPrivateEntryFunction: null,
    IndexOutOfBounds: bcs.struct('IndexOutOfBounds', { idx: bcs.u16() }),
    SecondaryIndexOutOfBounds: bcs.struct('SecondaryIndexOutOfBounds', {
        resultIdx: bcs.u16(),
        secondaryIdx: bcs.u16(),
    }),
    InvalidResultArity: bcs.struct('InvalidResultArity', { resultIdx: bcs.u16() }),
    InvalidGasCoinUsage: null,
    InvalidValueUsage: null,
    InvalidObjectByValue: null,
    InvalidObjectByMutRef: null,
    SharedObjectOperationNotAllowed: null,
});

const TypeArgumentError = bcs.enum('TypeArgumentError', {
    TypeNotFound: null,
    ConstraintNotSatisfied: null,
});

const ExecutionFailureStatus = bcs.enum('ExecutionFailureStatus', {
    InsufficientGas: null,
    InvalidGasObject: null,
    InvariantViolation: null,
    FeatureNotYetSupported: null,
    MoveObjectTooBig: bcs.struct('MoveObjectTooBig', {
        objectSize: bcs.u64(),
        maxObjectSize: bcs.u64(),
    }),
    MovePackageTooBig: bcs.struct('MovePackageTooBig', {
        objectSize: bcs.u64(),
        maxObjectSize: bcs.u64(),
    }),
    CircularObjectOwnership: bcs.struct('CircularObjectOwnership', { object: Address }),
    InsufficientCoinBalance: null,
    CoinBalanceOverflow: null,
    PublishErrorNonZeroAddress: null,
    IotaMoveVerificationError: null,
    MovePrimitiveRuntimeError: bcs.option(MoveLocation),
    MoveAbort: bcs.tuple([MoveLocation, bcs.u64()]),
    VMVerificationOrDeserializationError: null,
    VMInvariantViolation: null,
    FunctionNotFound: null,
    ArityMismatch: null,
    TypeArityMismatch: null,
    NonEntryFunctionInvoked: null,
    CommandArgumentError: bcs.struct('CommandArgumentError', {
        argIdx: bcs.u16(),
        kind: CommandArgumentError,
    }),
    TypeArgumentError: bcs.struct('TypeArgumentError', {
        argumentIdx: bcs.u16(),
        kind: TypeArgumentError,
    }),
    UnusedValueWithoutDrop: bcs.struct('UnusedValueWithoutDrop', {
        resultIdx: bcs.u16(),
        secondaryIdx: bcs.u16(),
    }),
    InvalidPublicFunctionReturnType: bcs.struct('InvalidPublicFunctionReturnType', {
        idx: bcs.u16(),
    }),
    InvalidTransferObject: null,
    EffectsTooLarge: bcs.struct('EffectsTooLarge', { currentSize: bcs.u64(), maxSize: bcs.u64() }),
    PublishUpgradeMissingDependency: null,
    PublishUpgradeDependencyDowngrade: null,
    PackageUpgradeError: bcs.struct('PackageUpgradeError', { upgradeError: PackageUpgradeError }),
    WrittenObjectsTooLarge: bcs.struct('WrittenObjectsTooLarge', {
        currentSize: bcs.u64(),
        maxSize: bcs.u64(),
    }),
    CertificateDenied: null,
    IotaMoveVerificationTimedout: null,
    SharedObjectOperationNotAllowed: null,
    InputObjectDeleted: null,
});

const ExecutionStatus = bcs.enum('ExecutionStatus', {
    Success: null,
    Failed: bcs.struct('ExecutionFailed', {
        error: ExecutionFailureStatus,
        command: bcs.option(bcs.u64()),
    }),
});

const GasCostSummary = bcs.struct('GasCostSummary', {
    computationCost: bcs.u64(),
    computationCostBurned: bcs.u64(),
    storageCost: bcs.u64(),
    storageRebate: bcs.u64(),
    nonRefundableStorageFee: bcs.u64(),
});

const Owner = bcs.enum('Owner', {
    AddressOwner: Address,
    ObjectOwner: Address,
    Shared: bcs.struct('Shared', {
        initialSharedVersion: bcs.u64(),
    }),
    Immutable: null,
});

const VersionDigest = bcs.tuple([bcs.u64(), ObjectDigest]);

const ObjectIn = bcs.enum('ObjectIn', {
    NotExist: null,
    Exist: bcs.tuple([VersionDigest, Owner]),
});

export const ObjectOut = bcs.enum('ObjectOut', {
    NotExist: null,
    ObjectWrite: bcs.tuple([ObjectDigest, Owner]),
    PackageWrite: VersionDigest,
});

const IDOperation = bcs.enum('IDOperation', {
    None: null,
    Created: null,
    Deleted: null,
});

const EffectsObjectChange = bcs.struct('EffectsObjectChange', {
    inputState: ObjectIn,
    outputState: ObjectOut,
    idOperation: IDOperation,
});

const UnchangedSharedKind = bcs.enum('UnchangedSharedKind', {
    ReadOnlyRoot: VersionDigest,
    MutateDeleted: bcs.u64(),
    ReadDeleted: bcs.u64(),
    Cancelled: bcs.u64(),
    PerEpochConfig: null,
});

const TransactionEffectsV1 = bcs.struct('TransactionEffectsV1', {
    status: ExecutionStatus,
    executedEpoch: bcs.u64(),
    gasUsed: GasCostSummary,
    transactionDigest: ObjectDigest,
    gasObjectIndex: bcs.option(bcs.u32()),
    eventsDigest: bcs.option(ObjectDigest),
    dependencies: bcs.vector(ObjectDigest),
    lamportVersion: bcs.u64(),
    changedObjects: bcs.vector(bcs.tuple([Address, EffectsObjectChange])),
    unchangedSharedObjects: bcs.vector(bcs.tuple([Address, UnchangedSharedKind])),
    auxDataDigest: bcs.option(ObjectDigest),
});

export const TransactionEffects = bcs.enum('TransactionEffects', {
    V1: TransactionEffectsV1,
});
