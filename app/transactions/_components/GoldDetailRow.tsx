import { useEffect, useState } from "react";
import {
  useWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { Grid, Button, Flex, Text } from "@radix-ui/themes";
import { TransactionInputDataForm } from "@/app/validationSchemas";
import { FormField } from "./FormField";
import axios from "axios";
import { NumericFormattedField } from "./NumericFormattedField";
import { TiDelete } from "react-icons/ti";

interface Props {
  index: number;
  register: UseFormRegister<TransactionInputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
  control: any;
  onRemove: () => void;
  lastGoldPrice: number;
  goldDetailsWatch: TransactionInputDataForm["goldDetails"];
}

const GoldDetailRow = ({
  index,
  register,
  setValue,
  errors,
  control,
  onRemove,
  lastGoldPrice,
  goldDetailsWatch,
}: Props) => {
  const [name, setName] = useState("");

  const goldId = useWatch({ control, name: `goldDetails.${index}.goldId` });
  const weight = useWatch({ control, name: `goldDetails.${index}.weight` });
  const price = useWatch({ control, name: `goldDetails.${index}.price` });
  const discount = useWatch({ control, name: `goldDetails.${index}.discount` });

  // const currentRow = (goldDetailsWatch ?? [])[index] ?? {};
  // const goldId = currentRow.goldId || "";
  // const weight = currentRow.weight || "0";
  // const price = currentRow.price || "0";
  // const discount = currentRow.discount || "0";

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
        error={errors?.goldDetails?.[index]?.amount?.message}
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

export default GoldDetailRow;
