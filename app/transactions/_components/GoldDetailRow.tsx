import { TransactionInputDataForm } from "@/app/validationSchemas";
import { Gold } from "@prisma/client";
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

interface Props {
  index: number;
  register: UseFormRegister<TransactionInputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
  control: any;
  onRemove: () => void;
  lastGoldPrice: number;
}

const GoldDetailRow = ({
  index,
  register,
  setValue,
  errors,
  control,
  onRemove,
  lastGoldPrice,
}: Props) => {
  const [gold, setGold] = useState<Gold | null>(null);

  const goldId = useWatch({ control, name: `goldDetails.${index}.goldId` });
  const weight = useWatch({ control, name: `goldDetails.${index}.weight` });
  const price = useWatch({ control, name: `goldDetails.${index}.price` });
  const discount = useWatch({ control, name: `goldDetails.${index}.discount` });

  useEffect(() => {
    const fetchGold = async () => {
      if (!goldId) {
        setGold(null);
        return;
      }
      if (gold?.id?.toString() === goldId) return;
      try {
        const res = await axios.get<Gold>(`/api/gold/${goldId}`);
        setGold(res.data ?? null);
        setValue(`goldDetails.${index}.price`, lastGoldPrice.toString());
      } catch {
        setGold(null);
      }
    };

    fetchGold();
  }, [goldId]);

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
      setGold(null);
      return;
    }

    try {
      const res = await axios.get<Gold>(`/api/gold/${id}`);
      const jew = res.data;
      setGold(jew); // ✅ set state — còn effect xử lý riêng bên dưới
    } catch {
      setGold(null);
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
            onChange={field.onChange}
            onBlur={handleBlur}
            placeholder="id"
          />
        )}
      />

      {gold ? (
        <TextField.Root value={gold.name} readOnly />
      ) : (
        <TextField.Root
          className="text-red-600"
          value="Lỗi hoặc không tồn tại"
          readOnly
        />
      )}

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
