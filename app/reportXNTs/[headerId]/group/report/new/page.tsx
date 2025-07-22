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
  params: { headerId: string };
}) => {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();
  return <ReportXNTForm headerId={headerId} />;
};

export default NewReportHeaderPage;
