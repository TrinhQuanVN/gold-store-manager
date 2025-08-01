import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import { Gold } from "@prisma/client";
import { Button, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useEffect } from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { TiDelete } from "react-icons/ti";
import { NumericFormattedField } from "./NumericFormattedField";

interface Props {
  index: number;
  setValue: UseFormSetValue<RawTransactionHeaderFormData>;
  control: Control<RawTransactionHeaderFormData>;
  onRemove: () => void;
  lastGoldPrice: number;
}

const GoldDetailRow = ({
  index,
  setValue,
  control,
  onRemove,
  lastGoldPrice,
}: Props) => {
  const detail = useWatch({ control, name: `goldDetails.${index}` });
  const { goldName, weight, price, discount } = detail ?? {};

  useEffect(() => {
    const w = parseFloat(weight || "0");
    const p = parseFloat(price || "0");
    const d = parseFloat(discount || "0");

    const amount = w * p - d;
    if (!isNaN(amount)) {
      setValue(`goldDetails.${index}.amount`, amount.toString());
    }
  }, [weight, price, discount, setValue, index]);

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value;
    if (!id) {
      return;
    }

    try {
      const res = await axios.get<Gold>(`/api/gold/${id}`);
      const gold = res.data;
      setValue(`goldDetails.${index}.goldName`, gold.name);
      setValue(`goldDetails.${index}.price`, lastGoldPrice.toString());
    } catch {
      setValue(`goldDetails.${index}.goldName`, "lỗi hoặc không tìm được");
    }
  };

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
        name={`goldDetails.${index}.goldId`}
        render={({ field }) => (
          <TextField.Root
            {...field}
            value={field.value}
            // disabled={!firstInit}
            onChange={field.onChange}
            onBlur={handleBlur}
            placeholder="id"
          />
        )}
      />

      <TextField.Root value={goldName ?? ""} readOnly className="" />

      <NumericFormattedField
        name={`goldDetails.${index}.weight`}
        placeholder="Trọng lượng"
        control={control}
        maximumFractionDigits={4}
      />
      <NumericFormattedField
        name={`goldDetails.${index}.price`}
        placeholder="Giá"
        control={control}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`goldDetails.${index}.discount`}
        placeholder="Giảm giá"
        control={control}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`goldDetails.${index}.amount`}
        placeholder="Thành tiền"
        control={control}
        maximumFractionDigits={0}
        disabled
      />
      <Button variant="soft" onClick={onRemove} type="button">
        <Flex align="center" gap="2">
          <TiDelete size={20} color="red" />
          <Text>Xoá</Text>
        </Flex>
      </Button>
    </Grid>
  );
};

export default GoldDetailRow;
