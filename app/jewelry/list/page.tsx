import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { convertPrismaJewelryWithCateogryAndTypeToString } from "@/prismaRepositories/StringConverted";
import { Flex } from "@radix-ui/themes";
import JewelryActions from "./JewelryActions";
// import JewelrySearchForm from "./JewelrySearchForm";
import { JewelryQuery, columnNames } from "./JewelryTable";
import { convertJewleryWithCategoryAndTypeToRaw } from "@/app/validationSchemas/jewelrySchemas";
import dynamic from "next/dynamic";
import { headers } from "next/headers";

interface Props {
  searchParams: JewelryQuery;
}

const JewelrySearchForm = dynamic(() => import("./JewelrySearchForm"), {
  // ssr: false,
  // loading: () => <ContactFormSkeleton />,
});
const JewelryTable = dynamic(() => import("./JewelryTable"), {
  // ssr: false,
  // loading: () => <ContactFormSkeleton />,
});

const JewelryPage = async ({ searchParams }: Props) => {
  const _searchParams = await searchParams;

  const orderDirection =
    _searchParams.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(_searchParams.page || "1");
  const pageSize = parseInt(_searchParams.pageSize || "10");

  let where: any = {};
  // 1️⃣ Trường tìm kiếm chính
  if (_searchParams.id) {
    where.id = parseInt(_searchParams.id);
  } else if (_searchParams.supplierId) {
    where.supplierId = {
      contains: _searchParams.supplierId,
      mode: "insensitive",
    };
  } else if (_searchParams.weight) {
    where.goldWeight = parseFloat(_searchParams.weight);
  } else if (_searchParams.reportProductCode) {
    where.reportProductCode = {
      contains: _searchParams.reportProductCode,
      mode: "insensitive",
    };
  }

  // 2️⃣ Lọc category / type
  if (_searchParams.categoryId) {
    where.categoryId = parseInt(_searchParams.categoryId);
  }
  if (_searchParams.jewelryTypeId) {
    where.typeId = parseInt(_searchParams.jewelryTypeId);
  }

  // 3️⃣ Lọc tồn kho
  if (_searchParams.inStock === "true") {
    // Chưa từng xuất kho
    where.transactionDetails = {
      none: {
        transactionHeader: {
          isExport: true,
        },
      },
    };
  } else if (_searchParams.inStock === "false") {
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
    orderBy: columnNames.includes(_searchParams.orderBy ?? "id")
      ? [
          { [_searchParams.orderBy ?? "createdAt"]: orderDirection },
          { id: "asc" },
        ]
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

  const _headers = await headers();

  const redirectToUrl =
    _headers.get("x-url") ??
    `/jewelry/list?${new URLSearchParams(
      Object.fromEntries(
        Object.entries(_searchParams).filter(
          ([_, v]) => v !== undefined && v !== null
        ) as [string, string][]
      )
    ).toString()}`;

  return (
    <Flex direction="column" gap="3">
      <JewelrySearchForm
        searchParams={_searchParams}
        categories={categories}
        types={types}
      />
      <JewelryActions />

      <JewelryTable
        searchParams={_searchParams}
        jewelries={convertJewelries}
        redirectToUrl={redirectToUrl}
      />
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
