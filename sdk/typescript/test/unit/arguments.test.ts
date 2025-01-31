// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { toB58 } from '@iota/bcs';
import { describe, expect, it } from 'vitest';

import { Arguments, Transaction } from '../../src/transactions';

describe('Arguments helpers', () => {
    it('can use Arguments for building a transaction', async () => {
        const args = [
            Arguments.object('0x123'),
            Arguments.receivingRef({
                objectId: '1',
                version: '123',
                digest: toB58(new Uint8Array(32).fill(0x1)),
            }),
            Arguments.sharedObjectRef({
                objectId: '2',
                mutable: true,
                initialSharedVersion: '123',
            }),
            Arguments.objectRef({
                objectId: '3',
                version: '123',
                digest: toB58(new Uint8Array(32).fill(0x1)),
            }),
            Arguments.pure.address('0x2'),
            Arguments.object.system(),
            Arguments.object.clock(),
            Arguments.object.random(),
            Arguments.object.denyList(),
        ];

        const tx = new Transaction();

        tx.moveCall({
            target: '0x2::foo::bar',
            arguments: args,
        });

        expect(tx.getData()).toMatchInlineSnapshot(`
			{
			  "commands": [
			    {
			      "$kind": "MoveCall",
			      "MoveCall": {
			        "arguments": [
			          {
			            "$kind": "Input",
			            "Input": 0,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 1,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 2,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 3,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 4,
			            "type": "pure",
			          },
			          {
			            "$kind": "Input",
			            "Input": 5,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 6,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 7,
			            "type": "object",
			          },
			          {
			            "$kind": "Input",
			            "Input": 8,
			            "type": "object",
			          },
			        ],
			        "function": "bar",
			        "module": "foo",
			        "package": "0x0000000000000000000000000000000000000000000000000000000000000002",
			        "typeArguments": [],
			      },
			    },
			  ],
			  "expiration": null,
			  "gasData": {
			    "budget": null,
			    "owner": null,
			    "payment": null,
			    "price": null,
			  },
			  "inputs": [
			    {
			      "$kind": "UnresolvedObject",
			      "UnresolvedObject": {
			        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000123",
			      },
			    },
			    {
			      "$kind": "Object",
			      "Object": {
			        "$kind": "Receiving",
			        "Receiving": {
			          "digest": "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
			          "objectId": "0x0000000000000000000000000000000000000000000000000000000000000001",
			          "version": "123",
			        },
			      },
			    },
			    {
			      "$kind": "Object",
			      "Object": {
			        "$kind": "SharedObject",
			        "SharedObject": {
			          "initialSharedVersion": "123",
			          "mutable": true,
			          "objectId": "0x0000000000000000000000000000000000000000000000000000000000000002",
			        },
			      },
			    },
			    {
			      "$kind": "Object",
			      "Object": {
			        "$kind": "ImmOrOwnedObject",
			        "ImmOrOwnedObject": {
			          "digest": "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
			          "objectId": "0x0000000000000000000000000000000000000000000000000000000000000003",
			          "version": "123",
			        },
			      },
			    },
			    {
			      "$kind": "Pure",
			      "Pure": {
			        "bytes": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI=",
			      },
			    },
			    {
			      "$kind": "UnresolvedObject",
			      "UnresolvedObject": {
			        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000005",
			      },
			    },
			    {
			      "$kind": "UnresolvedObject",
			      "UnresolvedObject": {
			        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000006",
			      },
			    },
			    {
			      "$kind": "UnresolvedObject",
			      "UnresolvedObject": {
			        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000008",
			      },
			    },
			    {
			      "$kind": "UnresolvedObject",
			      "UnresolvedObject": {
			        "objectId": "0x0000000000000000000000000000000000000000000000000000000000000403",
			      },
			    },
			  ],
			  "sender": null,
			  "version": 2,
			}
		`);
    });
});
