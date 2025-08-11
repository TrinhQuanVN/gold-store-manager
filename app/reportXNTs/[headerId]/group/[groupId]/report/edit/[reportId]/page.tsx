import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ReportXNTFormSkeleton from "../../_components/ReportXNTFormSkeleton";
import { convertReportXNTToNumber } from "@/prismaRepositories";
import { convertToRawReportXNTForm } from "@/app/reportXNTs/_components/convertToRawReportXNTHeaderForm";

const ReportXNTForm = dynamic(() => import("../../_components/ReportXNTForm"), {
  //   ssr: false,
  loading: () => <ReportXNTFormSkeleton />,
});

interface Props {
  params: { headerId: string; groupId: string; reportId: string };
}

const EditReportXNTPage = async ({ params }: Props) => {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const groupId = parseInt(_params.groupId);

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) notFound();

  const reportXNT = await prisma.reportXNT.findUnique({
    where: { id: parseInt(_params.reportId) },
  });
  if (!reportXNT) notFound();

  return (
    <ReportXNTForm
      reportXNT={convertToRawReportXNTForm(reportXNT)}
      headerId={headerId}
      groupId={groupId}
    />
  );
};

export default EditReportXNTPage;
