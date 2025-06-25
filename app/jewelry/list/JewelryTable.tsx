import { Jewelry, JewelryType, JewerlyCategory } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Badge, Flex, Table, Text } from "@radix-ui/themes";
import JewelryBadge from "@/app/components/JewelryBadge";
import NextLink from "next/link";

export interface JewelryQuery {
  orderBy: keyof Jewelry;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
  field?: "id" | "supplierId";
  value?: string;
  categoryId?: string;
  jewelryTypeId?: string;
  inStock?: "true" | "false";
}

interface Props {
  jewelries: (Jewelry & {
    jewelryType: JewelryType;
    category: JewerlyCategory;
  })[];
  searchParams: JewelryQuery;
}

const JewelryTable = ({ jewelries, searchParams }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell key={column.value}>
              {column.value === "totalWeight" ? (
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
                <Text>Mã nhà: {jewelry.supplierId || "-"}</Text>
              </Flex>
            </Table.Cell>

            <Table.Cell>
              <Flex direction="column" gap="1">
                <Text>{jewelry.name}</Text>
                <JewelryBadge
                  inStock={jewelry.inStock}
                  category={jewelry.category}
                  jewelryType={jewelry.jewelryType}
                />
                {jewelry.description && <Text>{jewelry.description}</Text>}
              </Flex>
            </Table.Cell>

            <Table.Cell>
              <Text>Vàng: {jewelry.goldWeight}g</Text>
              <Text>Đá: {jewelry.gemWeight}g</Text>
              <Text>Tổng: {jewelry.totalWeight}g</Text>
            </Table.Cell>

            <Table.Cell>{jewelry.reportXNTId || "-"}</Table.Cell>

            <Table.Cell>
              {new Date(jewelry.createdAt).toLocaleDateString("vi-VN")}
            </Table.Cell>
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
  { label: "Trọng lượng", value: "totalWeight" },
  { label: "Mã báo cáo", value: "reportXNTId" },
  { label: "Ngày tạo", value: "createdAt" },
];

export const columnNames = columns.map((column) => column.value);

export default JewelryTable;
