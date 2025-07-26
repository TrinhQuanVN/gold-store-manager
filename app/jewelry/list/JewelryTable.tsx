import JewelryBadge from "@/app/components/JewelryBadge";
import { JewleryWithCategoryAndTypeDataForm } from "@/app/validationSchemas/jewelrySchemas";
import { ConvertedJewelryWithCateogryAndType } from "@/prismaRepositories/StringConverted";
import { DateToStringVN, toStringVN } from "@/utils";
import { Jewelry } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

// export interface JewelryQuery {
//   orderBy: keyof Jewelry;
//   orderDirection: "asc" | "desc";
//   page: string;
//   pageSize: string;
//   field?: "id" | "supplierId";
//   value?: string;
//   categoryId?: string;
//   jewelryTypeId?: string;
//   inStock?: "true" | "false";
// }

export interface JewelryQuery {
  orderBy?: keyof Jewelry;
  orderDirection?: "asc" | "desc";
  page?: string;
  pageSize?: string;

  id?: string;
  supplierId?: string;
  weight?: string;
  reportProductCode?: string;

  categoryId?: string | null;
  jewelryTypeId?: string | null;
  inStock?: "true" | "false" | "all";
}
interface Props {
  jewelries: JewleryWithCategoryAndTypeDataForm[];
  searchParams: JewelryQuery;
}

const JewelryTable = ({ jewelries, searchParams }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell key={column.value}>
              {column.value === "goldWeight" ? (
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      orderDirection:
                        searchParams.orderBy === column.value &&
                        searchParams.orderDirection === "asc"
                          ? "desc"
                          : "asc",
                    },
                  }}
                >
                  {column.label}
                </NextLink>
              ) : (
                column.label
              )}
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon
                  className={`inline transition-transform ${
                    searchParams.orderDirection === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {jewelries.map((jewelry) => (
          <Table.Row key={jewelry.id}>
            <Table.Cell>
              <Flex direction="column">
                <Text>ID: {jewelry.id}</Text>
                <Text>Mã: {jewelry.supplierId || "-"}</Text>
              </Flex>
            </Table.Cell>

            <Table.Cell>
              <Flex direction="column" gap="1">
                <Link href={`/jewelry/${jewelry.id}`}>{jewelry.name}</Link>
                {jewelry.type && jewelry.category && (
                  <JewelryBadge
                    category={jewelry.category}
                    type={jewelry.type}
                  />
                )}
                {jewelry.description && <Text>{jewelry.description}</Text>}
              </Flex>
            </Table.Cell>

            <Table.Cell>
              <Flex direction="column" gap="2">
                <Text>Vàng: {toStringVN(+jewelry.goldWeight, 0, 4)} chỉ</Text>
                <Text>Đá: {toStringVN(+jewelry.gemWeight, 0, 4)} chỉ</Text>
                <Text>Tổng: {toStringVN(+jewelry.totalWeight, 0, 4)} chỉ</Text>
              </Flex>
            </Table.Cell>

            <Table.Cell>{jewelry.reportProductCode || "-"}</Table.Cell>

            <Table.Cell>{DateToStringVN(jewelry.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Jewelry;
}[] = [
  { label: "ID", value: "id" },
  { label: "Trang sức", value: "name" },
  { label: "Trọng lượng", value: "goldWeight" },
  { label: "Mã báo cáo", value: "reportProductCode" },
  { label: "Ngày tạo", value: "createdAt" },
];

export const columnNames = columns.map((column) => column.value);

export default JewelryTable;
