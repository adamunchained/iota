// Copyright (c) The Diem Core Contributors
// Copyright (c) The Move Contributors
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

extern crate test_generation;
use move_binary_format::file_format::{AbilitySet, Bytecode, SignatureToken};
use test_generation::abstract_state::{AbstractState, AbstractValue};

mod common;

#[test]
fn bytecode_readref() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    let (state2, _) = common::run_instruction(Bytecode::ReadRef, state1);
    assert_eq!(
        state2.stack_peek(0),
        Some(AbstractValue::new_primitive(SignatureToken::U64)),
        "stack type postcondition not met"
    );
}

#[test]
#[should_panic]
fn bytecode_readref_no_ref() {
    let state1 = AbstractState::new();
    common::run_instruction(Bytecode::ReadRef, state1);
}

#[test]
#[should_panic]
fn bytecode_readref_wrong_dereference() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    let (state2, _) = common::run_instruction(Bytecode::ReadRef, state1);
    assert!(
        state2.stack_peek(0) != Some(AbstractValue::new_primitive(SignatureToken::U64)),
        "stack type postcondition not met"
    );
}

#[test]
fn bytecode_writeref() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_primitive(SignatureToken::U64));
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    let (state2, _) = common::run_instruction(Bytecode::WriteRef, state1);
    assert_eq!(state2.stack_len(), 0, "stack type postcondition not met");
}

#[test]
#[should_panic]
fn bytecode_writeref_type_mismatch() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_primitive(SignatureToken::Bool));
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    common::run_instruction(Bytecode::WriteRef, state1);
}

#[test]
#[should_panic]
fn bytecode_writeref_stack_len_mismatch() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_primitive(SignatureToken::U64));
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    let (state2, _) = common::run_instruction(Bytecode::WriteRef, state1);
    assert!(state2.stack_len() != 0, "stack type postcondition not met");
}

#[test]
fn bytecode_feezeref() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::MutableReference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    let (state2, _) = common::run_instruction(Bytecode::FreezeRef, state1);
    assert_eq!(state2.stack_len(), 1, "stack len postcondition not met");
    assert_eq!(
        state2.stack_peek(0),
        Some(AbstractValue::new_reference(
            SignatureToken::Reference(Box::new(SignatureToken::U64)),
            AbilitySet::PRIMITIVES
        )),
        "stack type postcondition not met"
    );
}

#[test]
#[should_panic]
fn bytecode_feezeref_no_ref() {
    let state1 = AbstractState::new();
    common::run_instruction(Bytecode::FreezeRef, state1);
}

#[test]
#[should_panic]
fn bytecode_feezeref_already_immutable() {
    let mut state1 = AbstractState::new();
    state1.stack_push(AbstractValue::new_reference(
        SignatureToken::Reference(Box::new(SignatureToken::U64)),
        AbilitySet::PRIMITIVES,
    ));
    common::run_instruction(Bytecode::FreezeRef, state1);
}
