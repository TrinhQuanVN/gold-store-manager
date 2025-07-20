"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ContactGroup, GoldPrice } from "@prisma/client";
import { Button, Callout, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import {
  rawTransactionSchema,
  TransactionInputDataForm,
  TransactionOutputDataForm,
} from "@/app/validationSchemas";
import { ConvertedTransactionHeaderWithRelation } from "@/prismaRepositories/StringConverted";
import { toDateStringIso, toDateStringVn, toStringVN } from "@/utils";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";
import ContactForm from "./ContactForm";
import GoldTransactionForm from "./GoldTransactionForm";
import IsExportSegment from "./IsExportSegment";
import JewelryTransactionForm from "./JewelryTransactionForm";
import PaymentForm from "./PaymentForm";

interface Props {
  transactionHeaderWithRelation?: ConvertedTransactionHeaderWithRelation & {
    currentGoldPrice: number;
    totalAmount: number;
  };
  contactGroup: ContactGroup[];
}

const TransactionForm = ({
  transactionHeaderWithRelation,
  contactGroup,
}: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  // const [lastestGoldPrice, setLastestGoldPrice] = useState<number>(0);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionInputDataForm, any, TransactionOutputDataForm>({
    mode: "onSubmit",
    resolver: zodResolver(rawTransactionSchema),
    defaultValues: {
      header: {
        contactId: transactionHeaderWithRelation?.contactId?.toString() ?? "",
        note: transactionHeaderWithRelation?.note ?? "",
        date:
          transactionHeaderWithRelation?.createdAt ?? new Date().toISOString(),
        currentGoldPrice:
          transactionHeaderWithRelation?.currentGoldPrice?.toString() ?? "0",
        isExport: transactionHeaderWithRelation?.isExport ?? true,
        totalAmount:
          transactionHeaderWithRelation?.totalAmount.toString() ?? "0",
        paymentMethode: transactionHeaderWithRelation?.paymentMethode ?? "CK",
      },
      paymentAmounts: transactionHeaderWithRelation?.paymentAmounts.map(
        (p) => ({
          type: p.type,
          amount: p.amount.toString(),
        })
      ) ?? [
        { type: "CK", amount: "0" },
        { type: "TM", amount: "0" },
      ],
      goldDetails:
        transactionHeaderWithRelation?.goldTransactionDetails.map((g) => ({
          goldId: g.goldId.toString(),
          goldName: g.gold.name,
          price: g.price.toString(),
          weight: g.weight.toString(),
          discount: g.discount.toString() ?? "0",
          amount: g.amount.toString(),
        })) ?? [],
      jewelryDetails:
        transactionHeaderWithRelation?.jewelryTransactionDetails.map((j) => ({
          jewelryId: j.jewelryId.toString(),
          jewelryName: `${j.jewelry.name} - ${j.jewelry.jewelryType.name} - ${j.jewelry.category.name}`,
          price: j.price.toString(),
          weight: j.jewelry.totalWeight.toString(),
          discount: j.discount.toString() ?? "0",
          amount: j.amount.toString(),
        })) ?? [],
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("....");
      console.log(data);
      console.log("Form errors:", errors);
      setSubmitting(true);
      console.log();

      if (transactionHeaderWithRelation) {
        await axios.patch(
          "/api/transactions/" + transactionHeaderWithRelation.id,
          data
        );
      } else {
        console.log("start creating transaction");
        await axios.post("/api/transactions", data);
        console.log("end creating transaction");
      }
      router.push("/transactions/list");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Lỗi không xác định đã xảy ra.");
    }
  });

  const isExport = watch("header.isExport");

  const goldDetails = useWatch({
    control,
    name: "goldDetails",
  });
  const jewelryDetails = useWatch({
    control,
    name: "jewelryDetails",
  });

  const fetchGoldPriceByDate = async (date: Date) => {
    try {
      const response = await axios.get<GoldPrice>("/api/goldPrices", {
        params: { date: date.toISOString() },
      });
      const data = response.data;
      if (data) {
        setValue(
          "header.currentGoldPrice",
          Number(response.data.sell).toString()
        );
      }
    } catch (err) {
      console.error("Không thể lấy giá vàng theo ngày:", err);
      setValue("header.currentGoldPrice", "0");
    }
  };

  useEffect(() => {
    const sumAmount = (arr?: { amount?: string }[]) =>
      Array.isArray(arr)
        ? arr.reduce((total, item) => total + parseFloat(item.amount ?? "0"), 0)
        : 0;

    const total = sumAmount(goldDetails) + sumAmount(jewelryDetails);
    setValue("header.totalAmount", total.toString());
  }, [goldDetails, jewelryDetails, setValue]);

  // const flattenErrors = (errors: any, path = ""): string[] => {
  //   let result: string[] = [];
  //   for (const key in errors) {
  //     const currentPath = path ? `${path}.${key}` : key;
  //     if (errors[key]?.message) {
  //       result.push(`${currentPath}: ${errors[key].message}`);
  //     } else if (typeof errors[key] === "object") {
  //       result = result.concat(flattenErrors(errors[key], currentPath));
  //     }
  //   }
  //   return result;
  // };

  return (
    <div
      className={` p-4  ${
        isExport
          ? BackGroundTransactionFormColor.export.bg
          : BackGroundTransactionFormColor.import.bg
      } transition-colors`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* <Callout.Root color="red" className="mb-4">
          <ul className="list-disc ml-4 space-y-1 px-3 py-2">
            {flattenErrors(errors).map((err, idx) => (
              <li key={idx}>
                <Callout.Text>{err}</Callout.Text>
              </li>
            ))}
          </ul>
        </Callout.Root> */}
        {error && (
          <Callout.Root color="red" className="mb-4">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <Flex justify="center">
          <IsExportSegment control={control} />
        </Flex>

        <Flex
          justify="center"
          align="center"
          style={{ height: "100%" }}
          gap="3"
        >
          <Controller
            control={control}
            name="header.date"
            render={({ field }) => (
              <DatePicker
                locale={vi}
                dateFormat="dd/MM/yyyy HH:mm:ss"
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date) {
                    field.onChange(date.toISOString());
                    fetchGoldPriceByDate(date);
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Giờ"
                placeholderText="Chọn ngày giờ"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
          <label className="text-sm font-medium">Giá vàng:</label>
          <Controller
            control={control}
            name="header.currentGoldPrice"
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField.Root}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={0}
                value={field.value}
                onValueChange={(values) => field.onChange(values.value)}
                style={{ textAlign: "right" }}
              />
            )}
          />
        </Flex>

        <TextField.Root
          placeholder="Ghi chú"
          {...register("header.note")}
        ></TextField.Root>
        <ErrorMessage>{errors.header?.note?.message}</ErrorMessage>

        <Flex direction="column" gap="4">
          <ContactForm
            groups={contactGroup}
            name="header.contactId"
            control={control}
            contact={transactionHeaderWithRelation?.contact}
          />
          <ErrorMessage>{errors.header?.contactId?.message}</ErrorMessage>

          <GoldTransactionForm
            control={control}
            errors={errors}
            setValue={setValue}
          />

          <JewelryTransactionForm
            control={control}
            errors={errors}
            setValue={setValue}
          />
          <ErrorMessage>{errors.goldDetails?.message}</ErrorMessage>
        </Flex>

        <hr className="my-4 border-indigo-600" />

        <Flex justify="end" className="my-4 border-gray-300">
          <strong>
            Tổng tiền:{" "}
            {parseFloat(watch("header.totalAmount")) > 0
              ? toStringVN(parseFloat(watch("header.totalAmount")))
              : "0"}
          </strong>
        </Flex>

        <PaymentForm control={control} watch={watch} setValue={setValue} />

        <ErrorMessage>{errors.paymentAmounts?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          {transactionHeaderWithRelation ? "Cập nhật" : "Tạo mới"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;

export const BackGroundTransactionFormColor = {
  export: {
    bg: "bg-red-100",
    text: "text-red-700",
  },
  import: {
    bg: "bg-green-100",
    text: "text-green-700",
  },
} as const;
