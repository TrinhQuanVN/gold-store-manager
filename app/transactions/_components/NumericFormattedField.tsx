"use client";

import { NumericFormat } from "react-number-format";
import { Controller } from "react-hook-form";
import { TextField, Text, Flex } from "@radix-ui/themes";
import { formatNumberVN } from "@/utils/";
import { ErrorMessage } from "@/app/components";
import { TextAlignLeftIcon } from "@radix-ui/react-icons";

interface Props {
  name: string;
  control: any;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maximumFractionDigits?: number;
}

export const NumericFormattedField = ({
  name,
  control,
  placeholder,
  error,
  disabled = false,
  maximumFractionDigits = 0,
}: Props) => {
  return (
    <Flex direction="column">
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <NumericFormat
            style={{ textAlign: "right" }}
            customInput={TextField.Root}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            disabled={disabled}
            decimalScale={maximumFractionDigits}
            fixedDecimalScale={true}
            placeholder={placeholder}
            getInputRef={ref}
            value={field.value}
            onValueChange={(values) => {
              field.onChange(values.value); // raw number string
            }}
          />
        )}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Flex>
  );
};
