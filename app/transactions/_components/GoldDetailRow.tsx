import { useEffect, useState } from "react";
import {
  useWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Grid, Button } from "@radix-ui/themes";
import { RawTransactionDataForm } from "@/app/validationSchemas";
import { FormField } from "./FormField";
import axios from "axios";

interface Props {
  index: number;
  register: UseFormRegister<RawTransactionDataForm>;
  setValue: UseFormSetValue<RawTransactionDataForm>;
  errors: FieldErrors<RawTransactionDataForm>;
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

      <FormField
        placeholder="Trọng lượng"
        registerProps={register(`goldDetails.${index}.weight`)}
        error={errors?.goldDetails?.[index]?.weight?.message}
      />
      <FormField
        placeholder="Giá"
        registerProps={register(`goldDetails.${index}.price`)}
        error={errors?.goldDetails?.[index]?.price?.message}
      />
      <FormField
        placeholder="Giảm giá"
        registerProps={register(`goldDetails.${index}.discount`)}
        error={errors?.goldDetails?.[index]?.discount?.message}
      />
      <FormField
        placeholder="Thành tiền"
        readOnly
        value={(() => {
          const w = parseFloat(weight || "0");
          const p = parseFloat(price || "0");
          const d = parseFloat(discount || "0");
          return (w * p - d || 0).toFixed(0);
        })()}
      />
      <Button variant="ghost" onClick={onRemove}>
        X
      </Button>
    </Grid>
  );
};

export default GoldDetailRow;
