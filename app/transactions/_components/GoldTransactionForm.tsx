"use client";

import { ErrorMessage } from "@/app/components";
import {
  TransactionInputDataForm,
  TransactionOutputDataForm,
} from "@/app/validationSchemas";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { RiAddCircleLine } from "react-icons/ri";
import GoldDetailRow from "./GoldDetailRow";
import GoldDetailSummaryRow from "./GoldDetailSummaryRow";
import { useEffect, useState } from "react";
import { toNumberVN, toStringVN } from "@/utils";

const CustomCollapsible = dynamic(
  () => import("@/app/components/CustomCollapsible"),
  {
    ssr: false,
    // loading: () => <ContactFormSkeleton />,
  }
);

interface Props {
  control: Control<TransactionInputDataForm, any, TransactionOutputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
}

const GoldTransactionForm = ({ control, errors, setValue }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "goldDetails",
  });

  const goldDetailsWatch = useWatch({
    control,
    name: "goldDetails",
  });

  const totalCount =
    goldDetailsWatch?.filter((row) => row.goldId && row.goldId.trim() !== "")
      .length ?? 0;

  const totalWeight = goldDetailsWatch?.reduce((sum, row) => {
    const w = toNumberVN(row.weight || "0");
    return sum + (isNaN(w) ? 0 : w);
  }, 0);

  const totalDiscount = goldDetailsWatch?.reduce((sum, row) => {
    const d = toNumberVN(row.discount || "0");
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  const totalAmount = goldDetailsWatch?.reduce((sum, row) => {
    const a = toNumberVN(row.amount || "0");
    return sum + (isNaN(a) ? 0 : a);
  }, 0);

  const [title, setTitle] = useState("Nhẫn tròn");

  useEffect(() => {
    if (totalCount > 0) {
      const formatted = `${toStringVN(
        totalWeight
      )} chỉ nhẫn tròn = ${toStringVN(totalAmount)}`;
      setTitle(formatted);
    } else {
      setTitle("Nhẫn tròn");
    }
  }, [totalCount, totalWeight, totalAmount]);

  const currentGoldPrice = useWatch({
    control,
    name: "header.currentGoldPrice",
  });

  return (
    <CustomCollapsible title={title} defaultOpen={true}>
      <Flex direction="column" gap="2">
        <Grid
          columns="7"
          gap="3"
          align="center"
          style={{
            gridTemplateColumns: "60px 4fr 1fr 1fr 1fr 1fr 1fr",
          }}
        >
          <Text size="2" weight="bold" align="center">
            ID
          </Text>
          <Text size="2" weight="bold" align="center">
            Tên vàng
          </Text>
          <Text size="2" weight="bold" align="center">
            Trọng lượng
          </Text>
          <Text size="2" weight="bold" align="center">
            Đơn giá
          </Text>
          <Text size="2" weight="bold" align="center">
            Giảm giá
          </Text>
          <Text size="2" weight="bold" align="center">
            Thành tiền
          </Text>
          <Text size="2" weight="bold" align="center">
            Hành động
          </Text>
        </Grid>
        {fields.map((field, index) => (
          <Flex direction="column" key={field.id}>
            <GoldDetailRow
              key={field.id}
              index={index}
              setValue={setValue}
              control={control}
              onRemove={() => remove(index)}
              lastGoldPrice={parseFloat(currentGoldPrice) ?? 0}
            />
            <ErrorMessage>
              {errors?.goldDetails?.[index]?.goldId?.message}
            </ErrorMessage>
          </Flex>
        ))}
        <GoldDetailSummaryRow
          totalCount={totalCount}
          totalWeight={totalWeight}
          totalDiscount={totalDiscount}
          totalAmount={totalAmount}
        />

        <Flex justify="end">
          <Button
            type="button"
            size="2"
            onClick={() =>
              append({
                goldId: "",
                weight: "",
                price: "",
                discount: "",
                amount: "",
              })
            }
          >
            <RiAddCircleLine size="25" />
            <Text>Thêm</Text>
          </Button>
        </Flex>
      </Flex>
    </CustomCollapsible>
  );
};

export default GoldTransactionForm;
