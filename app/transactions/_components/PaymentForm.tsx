"use client";

import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import { toNumberVN } from "@/utils";
import { Flex, Grid } from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/components/context-menu";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";

const CustomCollapsible = dynamic(
  () => import("@/app/components/CustomCollapsible"),
  {
    ssr: false,
    // loading: () => <ContactFormSkeleton />,
  }
);

interface Props {
  control: Control<RawTransactionHeaderFormData>;
  watch: UseFormWatch<RawTransactionHeaderFormData>;
  setValue: UseFormSetValue<RawTransactionHeaderFormData>;
}

const PaymentForm = ({ control, setValue }: Props) => {
  const amounts = useWatch({ control: control, name: "payments" });

  useEffect(() => {
    const bank = amounts.find((a) => a.type === "CK");
    const cash = amounts.find((a) => a.type === "TM");

    const bankAmount = toNumberVN(bank?.amount || "0");
    const cashAmount = toNumberVN(cash?.amount || "0");

    if (bankAmount > 0 && cashAmount > 0) {
      setValue("paymentMethode", "CK_TM");
    } else if (bankAmount > 0) {
      setValue("paymentMethode", "CK");
    } else if (cashAmount > 0) {
      setValue("paymentMethode", "TM");
    } else {
      setValue("paymentMethode", "CK"); // mặc định nếu cả 2 đều = 0
    }
  }, [amounts, setValue]);

  const handleChangeAmount = (type: "CK" | "TM", value: string) => {
    const index = amounts.findIndex((item) => item.type === type);
    if (index >= 0) {
      const updated = [...amounts];
      updated[index].amount = value;
      setValue("payments", updated);
    } else {
      setValue("payments", [...amounts, { type, amount: value }]);
    }
  };

  const title = "Thanh toán";

  return (
    <CustomCollapsible title={title} defaultOpen={true}>
      <Flex direction="column" gap="3">
        <Controller
          name="payments"
          control={control}
          render={() => (
            <Grid columns="auto 1fr" gap="3" align="center">
              <Label className="font-bold">Chuyển khoản:</Label>
              <NumericFormat
                placeholder="Chuyển khoản"
                value={amounts.find((a) => a.type === "CK")?.amount || ""}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                onValueChange={(values) => {
                  handleChangeAmount("CK", values.value);
                }}
                customInput={InputWrapper}
              />

              <Label className="font-bold">Tiền mặt:</Label>
              <NumericFormat
                placeholder="Tiền mặt"
                value={amounts.find((a) => a.type === "TM")?.amount || ""}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                onValueChange={(values) => {
                  handleChangeAmount("TM", values.value);
                }}
                customInput={InputWrapper}
              />
            </Grid>
          )}
        />
      </Flex>
    </CustomCollapsible>
  );
};

export default PaymentForm;

// Wrapper để format với Radix
const InputWrapper = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      style={{
        padding: "8px 12px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "100%",
      }}
    />
  );
};
