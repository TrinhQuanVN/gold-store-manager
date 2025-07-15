import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ReportXNTHeaderFormSkeleton from "../../_components/ReportXNTHeaderFormSkeleton";
// import ContactForm from "../../_components/ContactForm";

const ReportXNTHeaderForm = dynamic(
  () => import("../../_components/ReportXNTHeaderForm"),
  {
    //   ssr: false,
    loading: () => <ReportXNTHeaderFormSkeleton />,
  }
);

interface Props {
  params: { headerId: string };
}

const EditReportXNTHeaderPage = async ({ params }: Props) => {
  const _params = await params;
  const taxPayers = await prisma.taxPayer.findMany();
  if (!taxPayers || taxPayers.length === 0) {
    notFound();
  }

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
    include: {
      taxPayer: true, // Include the ContactGroup relation
    },
  });
  if (!header) notFound();

  return <ReportXNTHeaderForm reportHeader={header} taxPayers={taxPayers} />;
};

export default EditReportXNTHeaderPage;
