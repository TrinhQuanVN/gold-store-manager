import dynamic from "next/dynamic";
import ReportXNTFormSkeleton from "../_components/ReportXNTFormSkeleton";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";

const ReportXNTForm = dynamic(() => import("../_components/ReportXNTForm"), {
  //   ssr: false,
  loading: () => <ReportXNTFormSkeleton />,
});

const NewReportHeaderPage = async ({
  params,
}: {
  params: { headerId: string; groupId: string };
}) => {
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

  return <ReportXNTForm headerId={headerId} groupId={groupId} />;
};

export default NewReportHeaderPage;
