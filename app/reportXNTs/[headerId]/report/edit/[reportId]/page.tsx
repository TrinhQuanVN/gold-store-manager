import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ReportXNTFormSkeleton from "../../_components/ReportXNTFormSkeleton";

const ReportXNTForm = dynamic(() => import("../../_components/ReportXNTForm"), {
  //   ssr: false,
  loading: () => <ReportXNTFormSkeleton />,
});

interface Props {
  params: { headerId: string; reportId: string };
}

const EditReportXNTPage = async ({ params }: Props) => {
  const _params = await params;

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) notFound();

  const reportXNT = await prisma.reportXNT.findUnique({
    where: { id: _params.reportId },
  });
  if (!reportXNT) notFound();

  return (
    <ReportXNTForm
      reportXNT={reportXNT}
      headerId={parseInt(_params.headerId)}
    />
  );
};

export default EditReportXNTPage;
