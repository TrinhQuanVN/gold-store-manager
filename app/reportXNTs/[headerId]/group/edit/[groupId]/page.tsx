import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ReportXNTFormSkeleton from "../../_components/ReportXNTGroupFormSkeleton";

const ReportXNTGroupForm = dynamic(
  () => import("../../_components/ReportXNTGroupForm"),
  {
    //   ssr: false,
    loading: () => <ReportXNTFormSkeleton />,
  }
);

interface Props {
  params: { headerId: string; groupId: string };
}

const EditReportXNTPage = async ({ params }: Props) => {
  const _params = await params;

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) notFound();

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: parseInt(_params.groupId) },
  });
  if (!group) notFound();

  return (
    <ReportXNTGroupForm
      groupId={parseInt(_params.groupId)}
      headerId={parseInt(_params.headerId)}
      group={{ name: group.name, stt: group.stt.toString() }}
    />
  );
};

export default EditReportXNTPage;
