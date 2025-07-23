"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GoldPrice } from "@prisma/client";
import { Button, Callout, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import {
  RawTransactionHeaderFormData,
  rawTransactionHeaderSchema,
} from "@/app/validationSchemas";
import { toStringVN } from "@/utils";
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
import { ContactWithGroup } from "@/types";

interface Props {
  id?: number;
  transaction?: RawTransactionHeaderFormData;
  contactGroup: ContactWithGroup[];
}

const TransactionForm = ({ id, transaction, contactGroup }: Props) => {
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
  } = useForm<RawTransactionHeaderFormData>({
    mode: "onChange",
    resolver: zodResolver(rawTransactionHeaderSchema),
    defaultValues: transaction ?? {
      date: new Date().toISOString(),
      currentGoldPrice: "",
      totalAmount: "",
      isExport: true,
      contactId: "",
      goldDetails: [],
      jewelryDetails: [],
      payments: [
        { amount: "", type: "CK" },
        { amount: "", type: "TM" },
      ],
      paymentMethode: "CK",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("....");
      console.log(data);
      console.log("Form errors:", errors);
      setSubmitting(true);
      console.log();

      if (transaction) {
        await axios.patch("/api/transactions/" + id, data);
      } else {
        await axios.post("/api/transactions", data);
      }
      router.push("/transactions/list");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Lỗi không xác định đã xảy ra.");
    }
  });

  const isExport = watch("isExport");

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
        setValue("currentGoldPrice", Number(response.data.sell).toString());
      }
    } catch (err) {
      console.error("Không thể lấy giá vàng theo ngày:", err);
      setValue("currentGoldPrice", "0");
    }
  };

  useEffect(() => {
    const sumAmount = (arr?: { amount?: string }[] | null) =>
      Array.isArray(arr)
        ? arr.reduce((total, item) => total + parseFloat(item.amount ?? "0"), 0)
        : 0;

    const total = sumAmount(goldDetails) + sumAmount(jewelryDetails);
    setValue("totalAmount", total.toString());
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
            name="date"
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
            name="currentGoldPrice"
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
          {...register("note")}
        ></TextField.Root>
        <ErrorMessage>{errors.note?.message}</ErrorMessage>

        <Flex direction="column" gap="4">
          <ContactForm contactGroup={contactGroup} control={control} />
          <ErrorMessage>{errors.contactId?.message}</ErrorMessage>

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
            {parseFloat(watch("totalAmount")) > 0
              ? toStringVN(parseFloat(watch("totalAmount")))
              : "0"}
          </strong>
        </Flex>

        <PaymentForm control={control} watch={watch} setValue={setValue} />

        <ErrorMessage>{errors.payments?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          {transaction ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
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
