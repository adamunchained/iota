// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { ButtonPill, InputType } from '@iota/apps-ui-kit';
import { CoinStruct } from '@iota/iota-sdk/client';
import { FormInput } from './';
import { useGasBudgetEstimation } from '../../hooks';

export interface SendTokenInputProps {
    coins: CoinStruct[];
    symbol: string;
    coinDecimals: number;
    activeAddress: string;
    setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
    values: {
        amount: string;
        to: string;
        isPayAllIota: boolean;
    };
    onActionClick: () => Promise<void>;
    isActionButtonDisabled?: boolean | 'auto';
    value: string;
    onChange: (value: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    errorMessage?: string;
}

export default function SendTokenFormInput({
    coins,
    values,
    symbol,
    coinDecimals,
    activeAddress,
    setFieldValue,
    onActionClick,
    isActionButtonDisabled,
    value,
    onChange,
    onBlur,
    errorMessage,
}: SendTokenInputProps) {
    const gasBudgetEstimation = useGasBudgetEstimation({
        coinDecimals,
        coins: coins ?? [],
        activeAddress,
        to: values.to,
        amount: values.amount,
        isPayAllIota: values.isPayAllIota,
        setFieldValue,
    });

    return (
        <FormInput
            type={InputType.NumericFormat}
            name="amount"
            label="Send Amount"
            placeholder="0.00"
            caption="Est. Gas Fees:"
            suffix={` ${symbol}`}
            decimals
            allowNegative={false}
            prefix={values.isPayAllIota ? '~ ' : undefined}
            amountCounter={coins ? gasBudgetEstimation : '--'}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errorMessage={errorMessage}
            renderAction={(isButtonDisabled) => (
                <ButtonPill
                    disabled={
                        isActionButtonDisabled === 'auto'
                            ? isButtonDisabled
                            : isActionButtonDisabled
                    }
                    onClick={onActionClick}
                >
                    Max
                </ButtonPill>
            )}
        />
    );
}
