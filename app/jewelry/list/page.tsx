import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import JewelryActions from "./JewelryActions";
import JewelrySearchForm from "./JewelrySearchForm";
import JewelryTable, { JewelryQuery, columnNames } from "./JewelryTable";
import {
  convertJewelryCategoryToNumber,
  convertJewelryRelationToNumber,
  convertJewelryTypeToNumber,
} from "@/prismaRepositories";

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

  let where: any = {};

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
      ? [{ [params.orderBy!]: orderDirection }, { id: "asc" }]
      : [{ id: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      category: true,
      jewelryType: true,
    },
  });

  const convertJewelries = jewelries.map(convertJewelryRelationToNumber);

  const [types, categories] = await Promise.all([
    prisma.jewelryType.findMany(),
    prisma.jewelryCategory.findMany(),
  ]);

  const jewelryCount = await prisma.jewelry.count({ where }); //

  return (
    <Flex direction="column" gap="3">
      <JewelryActions />
      <JewelrySearchForm
        searchParams={params}
        categories={categories.map(convertJewelryCategoryToNumber)}
        types={types.map(convertJewelryTypeToNumber)}
      />
      <JewelryTable searchParams={params} jewelries={convertJewelries} />
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
