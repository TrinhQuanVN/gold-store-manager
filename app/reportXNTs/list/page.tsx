import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import Pagination from "@/app/components/Pagination";
import ReportAction from "./ReportAction";
import ReportTable, { ReportQuery, columnNames } from "./ReportTable";
import { Prisma } from "@prisma/client";

interface Props {
  searchParams: ReportQuery;
}

const ReportPage = async ({ searchParams }: Props) => {
  const params = searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  // Không có filter nào ở đây, nhưng có thể mở rộng sau
  const where: Prisma.ReportXNTHeaderWhereInput = {};

  const reports = await prisma.reportXNTHeader.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const reportCount = await prisma.reportXNTHeader.count({ where });

  return (
    <Flex direction="column" gap="3">
      <ReportAction />
      <ReportTable searchParams={params} reports={reports} />
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
