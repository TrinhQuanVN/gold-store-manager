import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import GoldPriceActions from "./GoldPriceActions";
import GoldPriceSearchForm from "./GoldPriceSearchForm";
import GoldPriceTable from "./GoldPriceTable";
import { columnNames } from "./GoldPriceTable";
import { GoldPriceSearchQuery } from "./GoldPriceSearchQuery";
import { Prisma } from "@prisma/client";

interface Props {
  searchParams: GoldPriceSearchQuery;
}

const GoldPricesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  // Chuyển đổi ngày lọc (nếu có)
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate
    ? new Date(params.endDate + "T23:59:59")
    : undefined;

  const where: Prisma.GoldPriceWhereInput =
    startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {};

  const goldPrices = await prisma.goldPrice.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { id: "desc" }]
      : [{ id: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const goldPriceCount = await prisma.goldPrice.count({ where });

  return (
    <Flex direction="column" gap="3">
      <GoldPriceActions />
      <GoldPriceSearchForm searchParams={params} />
      <GoldPriceTable searchParams={params} goldPrices={goldPrices} />
      <Flex gap="2">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={goldPriceCount}
        />
      </Flex>
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export default GoldPricesPage;
