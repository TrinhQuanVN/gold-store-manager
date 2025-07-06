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
import {
  TransactionHeader,
  JewelryTransactionDetail,
  Gold,
  Jewelry,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { CustomCollapsible, ErrorMessage } from "@/app/components";
import { FormField } from "./FormField";
import axios from "axios";
import GoldDetailRow from "./GoldDetailRow";
import GoldDetailSummaryRow from "./GoldDetailSummaryRow";

interface Props {
  control: Control<TransactionInputDataForm, any, TransactionOutputDataForm>;
  setValue: UseFormSetValue<TransactionInputDataForm>;
  register: UseFormRegister<TransactionInputDataForm>;
  errors: FieldErrors<TransactionInputDataForm>;
  jewelryDetails: (JewelryTransactionDetail & { jewelry: Jewelry })[];
  lastestGoldPrice?: number;
}

const JewelryTransactionForm = ({
  control,
  register,
  errors,
  setValue,
  jewelryDetails,
  lastestGoldPrice,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "jewelryDetails",
  });

  useEffect(() => {
    if (jewelryDetails.length > 0) {
      // Prefill from edit data
      jewelryDetails.forEach((detail) =>
        append({
          id: detail.id.toString(),
          jewelryId: detail.jewelryId.toString(),
          weight: detail.jewelry.goldWeight.toString(),
          price: detail.price.toString(),
          discount: detail.discount.toString(),
          amount: detail.amount.toString(),
        })
      );
    } else if (fields.length === 0) {
      // Append 3 empty rows if creating new
      for (let i = 0; i < 3; i++) {
        append({
          id: "",
          jewelryId: "",
          weight: "",
          price: "",
          discount: "",
          amount: "",
        });
      }
    }
  }, []);

  const jewelryDetailsWatch = useWatch({
    control,
    name: "jewelryDetails",
  });

  const totalCount =
    jewelryDetailsWatch?.filter(
      (row) => row.jewelryId && row.jewelryId.trim() !== ""
    ).length ?? 0;

  const totalWeight = jewelryDetailsWatch?.reduce((sum, row) => {
    const w = parseFloat(row.weight || "0");
    return sum + (isNaN(w) ? 0 : w);
  }, 0);

  const totalDiscount = jewelryDetailsWatch?.reduce((sum, row) => {
    const d = parseFloat(row.discount || "0");
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  const totalAmount = jewelryDetailsWatch?.reduce((sum, row) => {
    const a = parseFloat(row.amount || "0");
    return sum + (isNaN(a) ? 0 : a);
  }, 0);

  const title =
    totalCount > 0
      ? `${totalCount} sản phẩm : ${totalWeight.toLocaleString(
          "vn-VN"
        )} chỉ = ${totalAmount.toLocaleString("vn-VN")}`
      : "Trang sức";

  return (
    <CustomCollapsible title={title}>
      <Flex direction="column" gap="4">
        <Grid columns="7" gap="3" align="center">
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
          <GoldDetailRow
            key={field.id}
            index={index}
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            onRemove={() => remove(index)}
            lastGoldPrice={lastestGoldPrice ?? 0}
            jewelryDetailsWatch={jewelryDetailsWatch}
          />
        ))}
        <GoldDetailSummaryRow
          totalCount={totalCount}
          totalWeight={totalWeight}
          totalDiscount={totalDiscount}
          totalAmount={totalAmount}
        />

        <Flex justify="end">
          <Button
            onClick={() =>{}
 
                weight: "",
                price: "",
                discount: "",
                amount: "",
                jewelryId: "",

              })
            }
          >
            Thêm dòng
          </Button>
        </Flex>
      </Flex>
    </CustomCollapsible>
  );
};

export default JewelryTransactionForm;
