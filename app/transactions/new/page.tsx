import dynamic from "next/dynamic";
import TransactionFormSkeleton from "../_components/TransactionFormSkeleton";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/client";

const TransactionForm = dynamic(
  () => import("../_components/TransactionForm"),
  {
    //   ssr: false,
    loading: () => <TransactionFormSkeleton />,
  }
);

const NewTransactionPage = async () => {
  return <TransactionForm />;
};

export default NewTransactionPage;
