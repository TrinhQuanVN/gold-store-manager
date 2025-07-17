import { TransactionInputDataForm } from "@/app/validationSchemas";
import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import { Button, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { TiDelete } from "react-icons/ti";
import { NumericFormattedField } from "./NumericFormattedField";
import { JewelryWithRelation } from "@/types";

interface Props {
  index: number;
  register: UseFormRegister<TransactionInputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
  control: any;
  onRemove: () => void;
  lastGoldPrice: number;
}

const JewelryDetailRow = ({
  index,
  register,
  setValue,
  errors,
  control,
  onRemove,
  lastGoldPrice,
}: Props) => {
  const detail = useWatch({ control, name: `jewelryDetails.${index}` });
  const { jewelryName, weight, price, discount } = detail ?? {};

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value;
    if (!id) {
      //trường hợp này sẽ xoá các dòng khác nếu xoá id
      setValue(`jewelryDetails.${index}.jewelryName`, "");
      setValue(`jewelryDetails.${index}.price`, "");
      setValue(`jewelryDetails.${index}.weight`, "");
      setValue(`jewelryDetails.${index}.discount`, "");
      setValue(`jewelryDetails.${index}.amount`, "");
      return;
    }

    try {
      const res = await axios.get<JewelryWithRelation>(`/api/jewelry/${id}`);
      const jew = res.data;
      setValue(
        `jewelryDetails.${index}.jewelryName`,
        `${jew.name} - ${jew.jewelryType.name} - ${jew.category.name}`
      );
      setValue(`jewelryDetails.${index}.weight`, jew.goldWeight.toString());

      setValue(`jewelryDetails.${index}.price`, lastGoldPrice.toString());
    } catch {
      setValue(
        `jewelryDetails.${index}.jewelryName`,
        "lỗi hoặc không tìm được"
      );
    }
  };

  useEffect(() => {
    const w = parseFloat(weight || "0");
    const p = parseFloat(price || "0");
    const d = parseFloat(discount || "0");

    const amount = w * p - d;
    if (!isNaN(amount)) {
      setValue(`jewelryDetails.${index}.amount`, amount.toFixed(0));
    }
  }, [weight, price, discount, setValue, index]);

  return (
    <Grid
      columns="7"
      gap="3"
      align="start"
      style={{
        gridTemplateColumns: "60px 4fr 1fr 1fr 1fr 1fr 1fr",
      }}
    >
      <Controller
        control={control}
        name={`jewelryDetails.${index}.jewelryId`}
        render={({ field }) => (
          <TextField.Root
            {...field}
            value={field.value}
            onChange={field.onChange}
            onBlur={handleBlur}
            placeholder="id"
          />
        )}
      />

      <TextField.Root
        value={jewelryName || "Lỗi hoặc không tồn tại"}
        readOnly
        className={!jewelryName ? "text-red-600" : ""}
      />

      <NumericFormattedField
        name={`jewelryDetails.${index}.weight`}
        placeholder="Trọng lượng"
        control={control}
        // error={errors?.jewelryDetails?.[index]?.weight?.message}
        maximumFractionDigits={4}
        disabled
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.price`}
        placeholder="Giá"
        control={control}
        // error={errors?.jewelryDetails?.[index]?.price?.message}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.discount`}
        placeholder="Giảm giá"
        control={control}
        // error={errors?.jewelryDetails?.[index]?.discount?.message}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.amount`}
        placeholder="Thành tiền"
        control={control}
        // error={errors?.jewelryDetails?.[index]?.amount?.message}
        maximumFractionDigits={0}
        disabled
      />

      <Button variant="soft" onClick={onRemove}>
        <Flex align="center" gap="2">
          <TiDelete size={20} color="red" />
          <Text>Xoá</Text>
        </Flex>
      </Button>
    </Grid>
  );
};

export default JewelryDetailRow;
