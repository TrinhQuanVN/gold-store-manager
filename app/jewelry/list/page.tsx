import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { convertPrismaJewelryWithCateogryAndTypeToString } from "@/prismaRepositories/StringConverted";
import { Flex } from "@radix-ui/themes";
import JewelryActions from "./JewelryActions";
// import JewelrySearchForm from "./JewelrySearchForm";
import JewelryTable, { JewelryQuery, columnNames } from "./JewelryTable";
import { convertJewleryWithCategoryAndTypeToRaw } from "@/app/validationSchemas/jewelrySchemas";
import dynamic from "next/dynamic";

interface Props {
  searchParams: JewelryQuery;
}

const JewelrySearchForm = dynamic(() => import("./JewelrySearchForm"), {
  // ssr: false,
  // loading: () => <ContactFormSkeleton />,
});

const JewelryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "10");

  let where: any = {};
  // 1️⃣ Trường tìm kiếm chính
  if (params.id) {
    where.id = parseInt(params.id);
  } else if (params.supplierId) {
    where.supplierId = {
      contains: params.supplierId,
      mode: "insensitive",
    };
  } else if (params.weight) {
    where.goldWeight = parseFloat(params.weight);
  } else if (params.reportProductCode) {
    where.reportProductCode = {
      contains: params.reportProductCode,
      mode: "insensitive",
    };
  }

  // 2️⃣ Lọc category / type
  if (params.categoryId) {
    where.categoryId = parseInt(params.categoryId);
  }
  if (params.jewelryTypeId) {
    where.typeId = parseInt(params.jewelryTypeId);
  }

  // 3️⃣ Lọc tồn kho
  if (params.inStock === "true") {
    // Chưa từng xuất kho
    where.transactionDetails = {
      none: {
        transactionHeader: {
          isExport: true,
        },
      },
    };
  } else if (params.inStock === "false") {
    // Đã từng xuất kho
    where.transactionDetails = {
      some: {
        transactionHeader: {
          isExport: true,
        },
      },
    };
  }

  const jewelries = await prisma.jewelry.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy ?? "id")
      ? [{ [params.orderBy ?? "createdAt"]: orderDirection }, { id: "asc" }]
      : [{ id: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      category: true,
      jewelryType: true,
    },
  });

  const convertJewelries = jewelries.map(
    convertJewleryWithCategoryAndTypeToRaw
  );

  const [types, categories] = await Promise.all([
    prisma.jewelryType.findMany(),
    prisma.jewelryCategory.findMany(),
  ]);

  const jewelryCount = await prisma.jewelry.count({ where }); //

  return (
    <Flex direction="column" gap="3">
      <JewelrySearchForm
        searchParams={params}
        categories={categories}
        types={types}
      />
      <JewelryActions />

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

// export const dynamic = "force-dynamic";

export default JewelryPage;
