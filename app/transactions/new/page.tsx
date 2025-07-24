import dynamic from "next/dynamic";
import TransactionFormSkeleton from "../_components/TransactionFormSkeleton";
import { prisma } from "@/prisma/client";

const TransactionForm = dynamic(
  () => import("../_components/TransactionForm"),
  {
    // ssr: true,
    loading: () => <TransactionFormSkeleton />,
  }
);

const NewTransactionPage = async () => {
  // const contactGroup = await prisma.contact.findMany({
  //   include: {
  //     group: true,
  //   },
  // });
  return <TransactionForm />;
};

export default NewTransactionPage;
