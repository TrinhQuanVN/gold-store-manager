import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import JewelryActions from "./JewelryActions";
import JewelrySearchForm from "./JewelrySearchForm";
import JewelryTable, { JewelryQuery, columnNames } from "./JewelryTable";

interface Props {
  searchParams: JewelryQuery;
}

const JewelryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "10");

  const field = params.field;
  const keyword = field ? params.value : undefined;

  const inStock = params.inStock !== "false"; // default true

  let where: any = {
    inStock,
  };

  if (field && keyword) {
    where = {
      ...where,
      [field]: {
        contains: keyword,
      },
    };
  } else {
    if (params.categoryId) {
      where = {
        ...where,
        categoryId: parseInt(params.categoryId),
      };
    }
    if (params.jewelryTypeId) {
      where = {
        ...where,
        jewelryTypeId: parseInt(params.jewelryTypeId),
      };
    }
  }

  const jewelries = await prisma.jewelry.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy!]: orderDirection }, { totalWeight: "desc" }]
      : [{ totalWeight: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      category: true,
      jewelryType: true,
    },
  });

  const jewelryCount = await prisma.jewelry.count({ where });

  return (
    <Flex direction="column" gap="3">
      <JewelryActions />
      <JewelrySearchForm searchParams={params} />
      <JewelryTable searchParams={params} jewelries={jewelries} />
      <Flex gap="2">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={jewelryCount}
        />
      </Flex>
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export default JewelryPage;
