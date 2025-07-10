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
  const contactgroups = await prisma.contactGroup.findMany();

  if (!contactgroups || contactgroups.length === 0) {
    notFound();
  }
  const contactwithgroups = await prisma.contact.findMany({
    include: {
      group: true, // Include the ContactGroup relation
    },
  });
  return <TransactionForm />;
};

export default NewTransactionPage;
