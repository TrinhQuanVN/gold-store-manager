import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { Button, Flex, TextField, Text } from "@radix-ui/themes";
import { RawTransactionDataForm } from "@/app/validationSchemas";
import { TransactionHeader, GoldTransactionDetail, Gold } from "@prisma/client";
import { useEffect } from "react";
import { CustomCollapsible, ErrorMessage } from "@/app/components";

interface Props {
  control: Control<RawTransactionDataForm>;
  register: UseFormRegister<RawTransactionDataForm>;
  errors: FieldErrors<RawTransactionDataForm>;
  goldDetails: (GoldTransactionDetail & { gold: Gold })[];
}

const GoldTransactionForm = ({
  control,
  register,
  errors,
  goldDetails,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "goldDetails",
  });

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
        {fields.map((field, index) => (
          <Flex key={field.id} gap="3" align="start">
            {/* Gold ID */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Gold ID"
                {...register(`goldDetails.${index}.goldId`)}
              />
              <ErrorMessage>
                {errors?.goldDetails?.[index]?.goldId?.message}
              </ErrorMessage>
            </Flex>

            {/* Gold Name (readonly) */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Tên vàng"
                readOnly
                // {...register(`goldDetails.${index}.name`)}
              />
            </Flex>

            {/* Weight */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Trọng lượng"
                {...register(`goldDetails.${index}.weight`)}
              />
              <ErrorMessage>
                {errors?.goldDetails?.[index]?.weight?.message}
              </ErrorMessage>
            </Flex>

            {/* Price */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Giá"
                {...register(`goldDetails.${index}.price`)}
              />
              <ErrorMessage>
                {errors?.goldDetails?.[index]?.price?.message}
              </ErrorMessage>
            </Flex>

            {/* Discount */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Giảm giá"
                {...register(`goldDetails.${index}.discount`)}
              />
            </Flex>

            {/* Amount */}
            <Flex direction="column">
              <TextField.Root
                placeholder="Thành tiền"
                {...register(`goldDetails.${index}.amount`)}
              />
            </Flex>

            {/* Remove */}
            <Button variant="ghost" onClick={() => remove(index)}>
              X
            </Button>
          </Flex>
        ))}

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
