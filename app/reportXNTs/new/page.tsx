import dynamic from "next/dynamic";
import ContactFormSkeleton from "../_components/ReportXNTHeaderFormSkeleton";
import { prisma } from "@/prisma/client";

const ReportHeaderForm = dynamic(
  () => import("../_components/ReportXNTHeaderForm"),
  {
    //   ssr: false,
    loading: () => <ContactFormSkeleton />,
  }
);

const NewReportHeaderPage = async () => {
  const taxPayers = await prisma.taxPayer.findMany();

  return <ReportHeaderForm taxPayers={taxPayers} />;
};

export default NewReportHeaderPage;
