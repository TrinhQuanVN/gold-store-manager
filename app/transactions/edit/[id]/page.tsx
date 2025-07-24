import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import TransactionFormSkeleton from "../../_components/TransactionFormSkeleton";
import { convertPrismaTransactionHeaderWithRelationToString } from "@/prismaRepositories/StringConverted";
import { toStringVN } from "@/utils";
import { converttoRawTransactionHeaderFormData } from "../../_components/convertToRaw";
// import ContactForm from "../../_components/ContactForm";

const TransactionForm = dynamic(
  () => import("../../_components/TransactionForm"),
  {
    // ssr: false,
    loading: () => <TransactionFormSkeleton />,
  }
);

interface Props {
  params: { id: string };
}

const EditTransactionPage = async ({ params }: Props) => {
  const _params = await params;
  const transaction = await prisma.transactionHeader.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      contact: {
        include: {
          group: true,
        },
      },
      goldTransactionDetails: {
        include: {
          gold: true,
        },
      },
      jewelryTransactionDetails: {
        include: {
          jewelry: true,
        },
      },
      paymentAmounts: true,
    },
  });
  if (!transaction) notFound();

  const converted = converttoRawTransactionHeaderFormData(transaction);

  return <TransactionForm transaction={converted} id={transaction.id} />;
};

export default EditTransactionPage;
