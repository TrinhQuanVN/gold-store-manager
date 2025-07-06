import { useEffect, useState } from "react";
import {
  useWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Grid, Button } from "@radix-ui/themes";
import { TransactionInputDataForm } from "@/app/validationSchemas";
import { FormField } from "./FormField";
import axios from "axios";
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
  const [name, setName] = useState("");

  const goldId = useWatch({ control, name: `goldDetails.${index}.goldId` });
  const weight = useWatch({ control, name: `goldDetails.${index}.weight` });
  const price = useWatch({ control, name: `goldDetails.${index}.price` });
  const discount = useWatch({ control, name: `goldDetails.${index}.discount` });

  useEffect(() => {
    const fetchGold = async () => {
      if (!goldId) {
        setName("");
        return;
      }

      try {
        const res = await axios.get(`/api/gold/${goldId}`);
        setName(res.data?.name ?? "Không tìm thấy");
        setValue(`goldDetails.${index}.price`, lastGoldPrice.toString());
      } catch {
        setName("Lỗi tải tên");
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

  return (
    <Grid columns="7" gap="3" align="start">
      <FormField
        placeholder="id"
        registerProps={register(`goldDetails.${index}.goldId`)}
        error={errors?.goldDetails?.[index]?.goldId?.message}
      />
      <FormField placeholder="Tên vàng" value={name} readOnly />

      <NumericFormattedField
        name={`goldDetails.${index}.weight`}
        placeholder="Trọng lượng"
        control={control}
        error={errors?.goldDetails?.[index]?.weight?.message}
        maximumFractionDigits={4}
      />

      <NumericFormattedField
        name={`goldDetails.${index}.price`}
        placeholder="Giá"
        control={control}
        error={errors?.goldDetails?.[index]?.price?.message}
        maximumFractionDigits={0}
      />

      <NumericFormattedField
        name={`goldDetails.${index}.discount`}
        placeholder="Giảm giá"
        control={control}
        error={errors?.goldDetails?.[index]?.discount?.message}
        maximumFractionDigits={0}
      />

      <NumericFormattedField
        name={`goldDetails.${index}.amount`}
        placeholder="Thành tiền"
        control={control}
        disabled
        maximumFractionDigits={0}
      />
      <Button variant="ghost" onClick={onRemove}>
        X
      </Button>
    </Grid>
  );
};

export default GoldDetailRow;
