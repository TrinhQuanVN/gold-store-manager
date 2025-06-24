import dynamic from "next/dynamic";
import ContactFormSkeleton from "../_components/ReportXNTHeaderFormSkeleton";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/client";

const ReportHeaderForm = dynamic(
  () => import("../_components/ReportXNTHeaderForm"),
  {
    //   ssr: false,
    loading: () => <ContactFormSkeleton />,
  }
);

const NewReportHeaderPage = async () => {
  const taxPayer = [{ id: 1, name: "Người nộp thuế mẫu" }]; // Replace with actual tax payer fetching logic

  return <ReportHeaderForm taxPayers={taxPayer} />;
};

export default NewReportHeaderPage;
