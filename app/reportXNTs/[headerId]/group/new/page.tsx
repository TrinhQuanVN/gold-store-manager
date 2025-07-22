import dynamic from "next/dynamic";
import ReportXNTGroupFormSkeleton from "../_components/ReportXNTGroupFormSkeleton";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";

const ReportXNTGroupForm = dynamic(
  () => import("../_components/ReportXNTGroupForm"),
  {
    //   ssr: false,
    loading: () => <ReportXNTGroupFormSkeleton />,
  }
);

const NewReportXNTGroupPage = async ({
  params,
}: {
  params: { headerId: string };
}) => {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();
  return <ReportXNTGroupForm headerId={headerId} />;
};

export default NewReportXNTGroupPage;
