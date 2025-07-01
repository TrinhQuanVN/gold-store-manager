"use client";

import { rawContactSchema } from "@/app/validationSchemas/contactSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionHeader,
  ContactGroup,
  JewelryTransactionDetail,
  Contact,
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { date, z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import TransactionTypeSegment from "./TransactionTypeSegment";
import ContactForm from "./ContactForm";
import { prisma } from "@/prisma/client";
import GolaTransactionTable from "./GoldTransactionTable";
import JewelryTransactionTable from "./JewelryTransactionTable";

interface Props {
  contactWithGroups: (Contact & { group: ContactGroup })[]; // List of contacts with their groups
  // header: TransactionHeader;
  // jewelryTransactionDetail: JewelryTransactionDetail[];
  // groups: ContactGroup[]; // List of available groups
}

const TransactionForm = ({ contactWithGroups }: Props) => {
  const router = useRouter();
  const [isExport, setIsExport] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof rawContactSchema>>({
    resolver: zodResolver(rawContactSchema),
    defaultValues: {},
  });

  const onSubmit = handleSubmit(
    async (data) => {}
    //   try {
    //     setSubmitting(true);
    //     if () {
    //       await axios.patch("/api/contacts/" + contact.id, data);
    //     } else {
    //       await axios.post("/api/contacts", data);
    //     }
    //     router.push("/contacts/list");
    //     router.refresh();
    //   } catch (err) {
    //     console.error(err);
    //     setSubmitting(false);
    //     setError("Lỗi không xác định đã xảy ra.");
    //   }
    // }
  );

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
          {...register("name")}
        ></TextField.Root>
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <ContactForm contacts={contactWithGroups} />
        <GolaTransactionTable transactionDate={new Date("2025-06-30")} />
        <JewelryTransactionTable transactionDate={new Date("2025-06-30")} />

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
