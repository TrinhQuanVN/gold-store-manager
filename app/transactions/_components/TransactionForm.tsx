"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Contact,
  ContactGroup,
  Gold,
  GoldPrice,
  GoldTransactionDetail,
  Jewelry,
  JewelryCategory,
  JewelryTransactionDetail,
  JewelryType,
  PaymentDetail,
  TransactionHeader,
} from "@prisma/client";
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
import { useRouter } from "next/navigation";
import ContactForm from "./ContactForm";
import GoldTransactionForm from "./GoldTransactionForm";
import JewelryTransactionForm from "./JewelryTransactionForm";
import IsExportSegment from "./IsExportSegment";
import PaymentForm from "./PaymentForm";
import { transformCurrencyStringToNumber } from "@/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";

interface Props {
  transactionHeaderWithRelation?: TransactionHeader & {
    contact: Contact & { group: ContactGroup };
    goldDetails?: (GoldTransactionDetail & { gold: Gold })[];
    jewelryDetails?: (JewelryTransactionDetail & {
      jewelry: Jewelry & { category: JewelryCategory; type: JewelryType };
    })[];
    paymentDetails: PaymentDetail[];
  };
}

const TransactionForm = ({ transactionHeaderWithRelation }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [lastestGoldPrice, setLastestGoldPrice] = useState<number>(0);
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
        contactId: transactionHeaderWithRelation?.contactId.toString(),
        note: transactionHeaderWithRelation?.note ?? undefined,
        date: transactionHeaderWithRelation?.createdAt ?? new Date(),
        isExport: transactionHeaderWithRelation?.isExport ?? true,
        totalAmount:
          transactionHeaderWithRelation?.totalAmount.toLocaleString("vn-VN"),
      },
      paymentAmounts: transactionHeaderWithRelation?.paymentDetails.map(
        (p) => ({
          type: p.type,
          amount: p.amount.toLocaleString("vn-VN"),
        })
      ) ?? [
        { type: "BANK", amount: "0" },
        { type: "CASH", amount: "0" },
      ],
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("...");
      console.log(data);
      setSubmitting(true);

      if (transactionHeaderWithRelation) {
        await axios.patch(
          "/api/transactions/" + transactionHeaderWithRelation.id,
          data
        );
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
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get<GoldPrice>("/api/goldPrices/lastest", {
          params: { name: "24K" },
        });
        setLastestGoldPrice(response.data.sell);
        console.log("lastest gold price: " + response.data.sell);
      } catch (err) {
        console.error("Lỗi lấy giá vàng:", err);
      }
    };
    fetchGoldPrice();
  }, []);

  const isExport = watch("header.isExport");
  const goldDetails = useWatch({
    control,
    name: "goldDetails",
  });
  const jewelryDetails = useWatch({
    control,
    name: "jewelryDetails",
  });

  useEffect(() => {
    const sumAmount = (arr?: { amount?: string }[]) =>
      Array.isArray(arr)
        ? arr.reduce(
            (total, item) =>
              total + transformCurrencyStringToNumber(item.amount ?? "0"),
            0
          )
        : 0;

    const total = sumAmount(goldDetails) + sumAmount(jewelryDetails);
    setValue("header.totalAmount", total.toString());
  }, [goldDetails, jewelryDetails, setValue]);

  return (
    <div
      className={` p-4  ${
        isExport
          ? BackGroundTransactionFormColor.export.bg
          : BackGroundTransactionFormColor.import.bg
      } transition-colors`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Callout.Root color="red" className="mb-4">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <Flex justify="center">
          <IsExportSegment control={control} />
        </Flex>

        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Controller
            control={control}
            name="header.date"
            render={({ field }) => (
              <DatePicker
                locale={vi}
                dateFormat="dd/MM/yyyy HH:mm:ss"
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date) field.onChange(date);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Giờ"
                placeholderText="Chọn ngày giờ"
                className="w-full border px-3 py-2 rounded"
              />
            )}
          />
        </Flex>

        <TextField.Root
          placeholder="Ghi chú"
          {...register("header.note")}
        ></TextField.Root>
        <ErrorMessage>{errors.header?.note?.message}</ErrorMessage>

        <ContactForm
          name="header.contactId"
          control={control}
          contact={transactionHeaderWithRelation?.contact}
        />
        <ErrorMessage>{errors.header?.contactId?.message}</ErrorMessage>

        <GoldTransactionForm
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
          goldDetails={transactionHeaderWithRelation?.goldDetails ?? []}
          lastestGoldPrice={lastestGoldPrice}
        />

        <JewelryTransactionForm
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
          jewelryDetails={transactionHeaderWithRelation?.jewelryDetails ?? []}
          lastestGoldPrice={lastestGoldPrice}
        />
        <ErrorMessage>{errors.goldDetails?.message}</ErrorMessage>

        <hr className="my-4 border-indigo-600" />

        <Flex justify="end" className="my-4 border-gray-300">
          <strong>
            Tổng tiền:{" "}
            {Number(watch("header.totalAmount")) > 0
              ? Number(watch("header.totalAmount")).toLocaleString("vi-VN")
              : "0"}
          </strong>
        </Flex>

        <PaymentForm
          control={control}
          watch={watch}
          setValue={setValue}
          paymentDetails={transactionHeaderWithRelation?.paymentDetails}
        />

        <ErrorMessage>{errors.paymentAmounts?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          {0 ? "Cập nhật" : "Tạo mới"} {isSubmitting && <Spinner />}
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
