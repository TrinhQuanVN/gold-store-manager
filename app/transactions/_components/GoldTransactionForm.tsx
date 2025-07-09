import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import { Button, Flex, TextField, Text, Grid } from "@radix-ui/themes";
import {
  TransactionInputDataForm,
  TransactionOutputDataForm,
} from "@/app/validationSchemas";
import { TransactionHeader, GoldTransactionDetail, Gold } from "@prisma/client";
import { useEffect, useState } from "react";
import { CustomCollapsible, ErrorMessage } from "@/app/components";
import { FormField } from "./FormField";
import axios from "axios";
import GoldDetailRow from "./GoldDetailRow";
import GoldDetailSummaryRow from "./GoldDetailSummaryRow";
import { RiAddCircleLine } from "react-icons/ri";

interface Props {
  control: Control<TransactionInputDataForm, any, TransactionOutputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  register: UseFormRegister<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
  goldDetails: (GoldTransactionDetail & { gold: Gold })[];
  lastestGoldPrice?: number;
}

const GoldTransactionForm = ({
  control,
  register,
  errors,
  setValue,
  goldDetails,
  lastestGoldPrice,
}: Props) => {
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
    const w = parseFloat(row.weight || "0");
    return sum + (isNaN(w) ? 0 : w);
  }, 0);

  const totalDiscount = goldDetailsWatch?.reduce((sum, row) => {
    const d = parseFloat(row.discount || "0");
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  const totalAmount = goldDetailsWatch?.reduce((sum, row) => {
    const a = parseFloat(row.amount || "0");
    return sum + (isNaN(a) ? 0 : a);
  }, 0);

  const title =
    totalCount > 0
      ? `${totalWeight.toLocaleString(
          "vn-VN"
        )} chỉ nhẫn tròn = ${totalAmount.toLocaleString("vn-VN")}`
      : "Nhẫn tròn";

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
              register={register}
              setValue={setValue}
              control={control}
              errors={errors}
              onRemove={() => remove(index)}
              lastGoldPrice={lastestGoldPrice ?? 0}
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
                goldId: "1",
                weight: "1",
                price: `${lastestGoldPrice}`,
                discount: "",
                amount: `${lastestGoldPrice}`,
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
