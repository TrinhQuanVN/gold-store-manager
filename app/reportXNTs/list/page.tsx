import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import ReportAction from "./ReportAction";
import ReportTable, { ReportQuery, columnNames } from "./ReportTable";
import { convertToRawReportXNTHeaderForm } from "../_components/convertToRawReportXNTHeaderForm";

interface Props {
  searchParams: ReportQuery;
}

const ReportPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  // Không có filter nào ở đây, nhưng có thể mở rộng sau
  const where: Prisma.ReportXNTHeaderWhereInput = {};

  const headers = await prisma.reportXNTHeader.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      taxPayer: true,
      group: {
        include: {
          ReportXNTs: true,
        },
      },
    },
  });

  const reportCount = await prisma.reportXNTHeader.count({ where });

  return (
    <Flex direction="column" gap="3">
      <ReportAction />
      <ReportTable
        searchParams={params}
        reports={headers?.map(convertToRawReportXNTHeaderForm)}
      />
      <Flex>
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          itemCount={reportCount}
        />
      </Flex>
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export default ReportPage;
