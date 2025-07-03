"use client";

import { rawContactSchema } from "@/app/validationSchemas/contactSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionHeader,
  ContactGroup,
  JewelryTransactionDetail,
  Contact,
  GoldPrice,
  GoldTransactionDetail,
} from "@prisma/client";
import {
  Button,
  Callout,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import TransactionTypeSegment from "./TransactionTypeSegment";
import ContactForm from "./ContactForm";
import { prisma } from "@/prisma/client";
import GolaTransactionTable from "./GoldTransactionTable";
import JewelryTransactionTable from "./JewelryTransactionTable";
import { createEmptyGoldRows, createEmptyJewelryRows } from "./initialEmptyRow";
import {
  rawGoldTransactionSchema,
  rawTransactionSchema,
} from "@/app/validationSchemas";
import { useRouter } from "next/navigation";

interface Props {
  transactionHeaderWithRelation?: string;
}

const TransactionForm = ({ transactionHeaderWithRelation }: Props) => {
  const [selectedContact, setSelectedContact] = useState<
    (Contact & { group: ContactGroup }) | null
  >(null);
  const router = useRouter();
  const [isExport, setIsExport] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [lastestGoldPrice, setLastestGoldPrice] = useState<number>(0);
  const [goldTransactionDetails, setGoldTransactionDetails] =
    useState<z.infer<typeof rawGoldTransactionSchema>[]>(createEmptyGoldRows);

  const [jewelryTransactionDetails, setJewelryTransactionDetails] = useState<
    z.infer<typeof rawGoldTransactionSchema>[]
  >(createEmptyJewelryRows);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof rawTransactionSchema>>({
    resolver: zodResolver(rawTransactionSchema),
    defaultValues: {},
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (!selectedContact) {
      }
      if (transactionHeaderWithRelation) {
        // await axios.patch("/api/contacts/" + contact.id, data);
      } else {
        // await axios.post("/api/contacts", data);
      }
      router.push("/contacts/list");
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

  return (
    <div
      className={`p-4 rounded-lg ${
        isExport
          ? BackGroundTransactionFormColor.export.bg
          : BackGroundTransactionFormColor.import.bg
      } transition-colors`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Flex justify="center">
          <TransactionTypeSegment
            isExport={isExport}
            setIsExport={setIsExport}
          />
        </Flex>
        <TextField.Root
          placeholder="Ghi chú"
          {...register("note")}
        ></TextField.Root>

        <ContactForm
          value={selectedContact}
          onChange={(contact) => setSelectedContact(contact)}
        />

        <GolaTransactionTable
          value={goldTransactionDetails}
          onChange={setGoldTransactionDetails}
          lastestGoldPrice={lastestGoldPrice}
        />
        <JewelryTransactionTable
          lastestGoldPrice={lastestGoldPrice}
          value={jewelryTransactionDetails}
          onChange={setJewelryTransactionDetails}
        />

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
