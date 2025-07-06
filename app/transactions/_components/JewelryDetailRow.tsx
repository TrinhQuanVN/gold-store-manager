import { useEffect, useState } from "react";
import {
  useWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  Controller,
} from "react-hook-form";
import { Grid, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { TransactionInputDataForm } from "@/app/validationSchemas";
import { FormField } from "./FormField";
import axios from "axios";
import { NumericFormattedField } from "./NumericFormattedField";
import { TiDelete } from "react-icons/ti";
import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import { JewelryBadge } from "@/app/components";

type JewelryWithRelation = Jewelry & {
  category: JewelryCategory;
  jewelryType: JewelryType;
};

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
  const [jewelry, setJewelry] = useState<JewelryWithRelation | null>(null);

  const weight = useWatch({ control, name: `jewelryDetails.${index}.weight` });
  const price = useWatch({ control, name: `jewelryDetails.${index}.price` });
  const discount = useWatch({
    control,
    name: `jewelryDetails.${index}.discount`,
  });

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value;
    if (!id) {
      setJewelry(null);
      return;
    }

    try {
      const res = await axios.get<JewelryWithRelation>(`/api/jewelry/${id}`);
      const jew = res.data;
      setJewelry(jew); // ✅ set state — còn effect xử lý riêng bên dưới
    } catch {
      setJewelry(null);
    }
  };

  useEffect(() => {
    if (!jewelry) return;

    console.log("✅ Jewelry updated:", jewelry);
    setValue(
      `jewelryDetails.${index}.price`,
      ((lastGoldPrice * jewelry.jewelryType.goldPercent) / 100).toFixed(0)
    );
    setValue(`jewelryDetails.${index}.weight`, jewelry.totalWeight.toString());
  }, [jewelry]);

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
      {jewelry ? (
        <TextField.Root
          value={`${jewelry.name} - ${jewelry.jewelryType.name} - ${jewelry.category.name}`}
          disabled
        />
      ) : (
        <TextField.Root value="Lỗi hoặc không tồn tại" disabled />
      )}
      <NumericFormattedField
        name={`jewelryDetails.${index}.weight`}
        placeholder="Trọng lượng"
        control={control}
        error={errors?.jewelryDetails?.[index]?.weight?.message}
        maximumFractionDigits={4}
        disabled
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.price`}
        placeholder="Giá"
        control={control}
        error={errors?.jewelryDetails?.[index]?.price?.message}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.discount`}
        placeholder="Giảm giá"
        control={control}
        error={errors?.jewelryDetails?.[index]?.discount?.message}
        maximumFractionDigits={0}
      />
      <NumericFormattedField
        name={`jewelryDetails.${index}.amount`}
        placeholder="Thành tiền"
        control={control}
        error={errors?.jewelryDetails?.[index]?.amount?.message}
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
