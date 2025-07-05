import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Button, Flex, TextField, Text, Grid } from "@radix-ui/themes";
import { RawTransactionDataForm } from "@/app/validationSchemas";
import { TransactionHeader, GoldTransactionDetail, Gold } from "@prisma/client";
import { useEffect, useState } from "react";
import { CustomCollapsible, ErrorMessage } from "@/app/components";
import { FormField } from "./FormField";
import GoldDetailWatcher from "./GoldDetailWatcher";
import axios from "axios";
import GoldDetailRow from "./GoldDetailRow";

interface Props {
  control: Control<RawTransactionDataForm>;
  setValue: UseFormSetValue<RawTransactionDataForm>;
  getValues: UseFormGetValues<RawTransactionDataForm>;
  register: UseFormRegister<RawTransactionDataForm>;
  errors: FieldErrors<RawTransactionDataForm>;
  goldDetails: (GoldTransactionDetail & { gold: Gold })[];
  watch: UseFormWatch<RawTransactionDataForm>;
  lastestGoldPrice?: number;
}

const GoldTransactionForm = ({
  control,
  register,
  errors,
  setValue,
  getValues,
  watch,
  goldDetails,
  lastestGoldPrice,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "goldDetails",
  });

  const [goldNames, setGoldNames] = useState<Record<number, string>>({});

  const updateGoldName = (index: number, name: string) => {
    setGoldNames((prev) => ({ ...prev, [index]: name }));
  };

  useEffect(() => {
    if (goldDetails.length > 0) {
      // Prefill from edit data
      goldDetails.forEach((detail) =>
        append({
          id: detail.id.toString(),
          goldId: detail.goldId.toString(),
          price: detail.price.toString(),
          weight: detail.weight.toString(),
          discount: detail.discount.toString(),
          amount: detail.amount.toString(),
        })
      );
    } else if (fields.length === 0) {
      // Append 3 empty rows if creating new
      for (let i = 0; i < 3; i++) {
        append({
          goldId: "",
          price: "",
          weight: "",
          discount: "",
          amount: "",
        });
      }
    }
  }, []);

  return (
    <CustomCollapsible title="Nhẫn tròn">
      <Flex direction="column" gap="4">
        <Grid columns="7" gap="3" align="center">
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
          <GoldDetailRow
            key={field.id}
            index={index}
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            onRemove={() => remove(index)}
            lastGoldPrice={lastestGoldPrice ?? 0}
          />
        ))}
        {/* {fields.map((field, index) => (
          <Grid key={field.id} columns="7" gap="3" align="start">
            <FormField
              placeholder="id"
              registerProps={register(`goldDetails.${index}.goldId`)}
              error={errors?.goldDetails?.[index]?.goldId?.message}
            />
            <FormField
              placeholder="Tên vàng"
              readOnly
              // registerProps={register(`goldDetails.${index}.name`)}
            />
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
            />
            <FormField
              placeholder="Thành tiền"
              registerProps={register(`goldDetails.${index}.amount`)}
            />
            <Button variant="ghost" onClick={() => remove(index)}>
              X
            </Button>
          </Grid>
        ))} */}

        <Button
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
          Thêm dòng
        </Button>
      </Flex>
    </CustomCollapsible>
  );
};

export default GoldTransactionForm;
