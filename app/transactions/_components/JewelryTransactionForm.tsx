import { CustomCollapsible, ErrorMessage } from "@/app/components";
import {
  TransactionInputDataForm,
  TransactionOutputDataForm,
} from "@/app/validationSchemas";
import { Jewelry, JewelryTransactionDetail } from "@prisma/client";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { RiAddCircleLine } from "react-icons/ri";
import GoldDetailSummaryRow from "./GoldDetailSummaryRow";
import JewelryDetailRow from "./JewelryDetailRow";

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
    }
  }, []);

  const jewelryDetailsWatch =
    useWatch({
      control,
      name: "jewelryDetails",
    }) ?? [];

  const { totalCount, totalWeight, totalDiscount, totalAmount } =
    jewelryDetailsWatch.reduce(
      (acc, row) => {
        const hasJewelry = row.jewelryId?.trim();
        const weight = parseFloat(row.weight || "0");
        const discount = parseFloat(row.discount || "0");
        const amount = parseFloat(row.amount || "0");

        if (hasJewelry) acc.totalCount += 1;
        if (!isNaN(weight)) acc.totalWeight += weight;
        if (!isNaN(discount)) acc.totalDiscount += discount;
        if (!isNaN(amount)) acc.totalAmount += amount;

        return acc;
      },
      { totalCount: 0, totalWeight: 0, totalDiscount: 0, totalAmount: 0 }
    );

  const title =
    totalCount > 0
      ? `${totalCount} sản phẩm : ${totalWeight.toLocaleString(
          "vi-VN"
        )} chỉ = ${totalAmount.toLocaleString("vi-VN")}`
      : "Trang sức";

  return (
    <CustomCollapsible title={title}>
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
          <Flex direction="column" key={field.id}>
            <JewelryDetailRow
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
              {[
                errors?.jewelryDetails?.[index]?.jewelryId?.message,
                errors?.jewelryDetails?.[index]?.price?.message,
                errors?.jewelryDetails?.[index]?.weight?.message,
                errors?.jewelryDetails?.[index]?.amount?.message,
              ]
                .filter(Boolean)
                .join(", ")}
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
            size="2"
            onClick={() =>
              append({
                jewelryId: "",
                weight: "",
                price: "",
                discount: "",
                amount: "",
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

export default JewelryTransactionForm;
