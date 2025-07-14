import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import Pagination from "@/app/components/Pagination";
import ReportAction from "./ReportAction";
import ReportTable, { ReportQuery, columnNames } from "./ReportTable";
import { Prisma } from "@prisma/client";
import { reportXNTHeaderWithRelation } from "@/types";
import ReportXNTHeaderModel from "./ReportXNTHeaderModel";

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
      reportXNTs: true,
    },
  });

  const reports: ReportXNTHeaderModel[] = headers.map((header) => {
    const tonDauKy = header.reportXNTs.reduce(
      (sum, xnt) => sum + xnt.tonDauKyValue,
      0
    );
    const nhapTrongKy = header.reportXNTs.reduce(
      (sum, xnt) => sum + xnt.nhapValue,
      0
    );
    const xuatTrongKy = header.reportXNTs.reduce(
      (sum, xnt) => sum + xnt.xuatValue,
      0
    );
    const tonCuoiKy = header.reportXNTs.reduce(
      (sum, xnt) => sum + xnt.tonCuoiKyValue,
      0
    );
    const xuatThucTe = header.reportXNTs.reduce(
      (sum, xnt) => sum + xnt.xuatQuantity,
      0
    );
    const thue = xuatTrongKy * 0.1; // giả sử VAT 10%

    return {
      id: header.id,
      name: `${header.name} ${header.quarter}/${header.year}`,
      tonDauKy,
      nhapTrongKy,
      xuatTrongKy,
      tonCuoiKy,
      xuatThucTe,
      thue,
    };
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
