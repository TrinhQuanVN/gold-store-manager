import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import TransactionFormSkeleton from "../../_components/TransactionFormSkeleton";
import { convertPrismaTransactionHeaderWithRelationToString } from "@/prismaRepositories/StringConverted";
import { toStringVN } from "@/utils";
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
          jewelry: {
            include: {
              category: true,
              jewelryType: true,
            },
          },
        },
      },
      paymentAmounts: true,
    },
  });
  if (!transaction) notFound();

  const goldTotal = transaction.goldTransactionDetails.reduce(
    (sum, g) => sum + Number(g.amount ?? 0),
    0
  );
  const jewelryTotal = transaction.jewelryTransactionDetails.reduce(
    (sum, j) => sum + Number(j.amount ?? 0),
    0
  );
  const currentGoldPrice = await prisma.goldPrice.findFirst({
    where: {
      createdAt: {
        lte: transaction.createdAt, // tìm bản ghi gần nhất trước thời điểm này
      },
    },
    orderBy: {
      createdAt: "desc", // mới nhất trước thời điểm truyền vào
    },
  });

  const converted = {
    ...convertPrismaTransactionHeaderWithRelationToString(transaction),
    totalAmount: goldTotal + jewelryTotal,
    currentGoldPrice: Number(currentGoldPrice?.sell ?? 0),
  };

  const contactGroup = await prisma.contactGroup.findMany();

  console.log(converted.createdAt);

  return (
    <TransactionForm
      transactionHeaderWithRelation={converted}
      contactGroup={contactGroup}
    />
  );
};

export default EditTransactionPage;
