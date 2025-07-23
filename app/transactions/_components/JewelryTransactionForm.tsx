"use client";

import { ErrorMessage } from "@/app/components";
import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { RiAddCircleLine } from "react-icons/ri";
import GoldDetailSummaryRow from "./GoldDetailSummaryRow";
import JewelryDetailRow from "./JewelryDetailRow";

const CustomCollapsible = dynamic(
  () => import("@/app/components/CustomCollapsible"),
  {
    ssr: false,
    // loading: () => <ContactFormSkeleton />,
  }
);

interface Props {
  control: Control<RawTransactionHeaderFormData>;
  setValue: UseFormSetValue<RawTransactionHeaderFormData>;
  errors: FieldErrors<RawTransactionHeaderFormData>;
}

const JewelryTransactionForm = ({ control, errors, setValue }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "jewelryDetails",
  });

  const jewelryDetailsWatch =
    useWatch({
      control,
      name: "jewelryDetails",
    }) ?? [];

  const { totalCount, totalWeight, totalDiscount, totalAmount } =
    jewelryDetailsWatch.reduce(
      (acc, row) => {
        const hasJewelry = row.jewelryId?.trim();
        const weight = parseFloat(row.weight || "0");
        const discount = parseFloat(row.discount || "0");
        const amount = parseFloat(row.amount || "0");

        if (hasJewelry) acc.totalCount += 1;
        if (!isNaN(weight)) acc.totalWeight += weight;
        if (!isNaN(discount)) acc.totalDiscount += discount;
        if (!isNaN(amount)) acc.totalAmount += amount;

        return acc;
      },
      { totalCount: 0, totalWeight: 0, totalDiscount: 0, totalAmount: 0 }
    );

  const [title, setTitle] = useState("Trang sức");

  useEffect(() => {
    if (totalCount > 0) {
      const formatted = `Trang sức tổng: ${totalWeight.toLocaleString(
        "vi-VN"
      )} chỉ = ${totalAmount.toLocaleString("vi-VN")}`;
      setTitle(formatted);
    } else {
      setTitle("Trang sức");
    }
  }, [totalCount, totalWeight, totalAmount]);

  const currentGoldPrice = useWatch({
    control,
    name: "currentGoldPrice",
  });

  return (
    <CustomCollapsible title={title}>
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
            Tên trang sức
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
            <JewelryDetailRow
              key={field.id}
              index={index}
              setValue={setValue}
              control={control}
              onRemove={() => remove(index)}
              lastGoldPrice={parseFloat(currentGoldPrice) ?? 0}
            />
            <ErrorMessage>
              {[
                errors?.jewelryDetails?.[index]?.jewelryId?.message,
                errors?.jewelryDetails?.[index]?.price?.message,
                errors?.jewelryDetails?.[index]?.weight?.message,
                errors?.jewelryDetails?.[index]?.amount?.message,
              ]
                .filter(Boolean)
                .join(", ")}
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
                jewelryId: "",
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

export default JewelryTransactionForm;
