import { GoldPrice } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { GoldPriceSearchQuery } from "./GoldPriceSearchQuery";

const columns: {
  label: string;
  value: keyof GoldPrice;
  className?: string;
}[] = [
  { label: "ID", value: "id" },
  {
    label: "Tên",
    value: "name",
  },
  {
    label: "Giá mua",
    value: "buy",
  },
  {
    label: "Giá bán",
    value: "sell",
  },
  {
    label: "Ngày tạo",
    value: "createdAt",
  },
];

export const columnNames = columns.map((column) => column.value);

const GoldPriceTable = ({
  searchParams,
  goldPrices,
}: {
  searchParams: GoldPriceSearchQuery;
  goldPrices: GoldPrice[];
}) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell key={column.value}>
              <Link
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
              </Link>
              {searchParams.orderBy === column.value && (
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
        {goldPrices.map((price) => (
          <Table.Row key={price.id}>
            <Table.Cell>{price.id}</Table.Cell>
            <Table.Cell>{price.name}</Table.Cell>
            <Table.Cell>{price.buy.toLocaleString("vi-VN")}</Table.Cell>
            <Table.Cell>{price.sell.toLocaleString("vi-VN")}</Table.Cell>
            <Table.Cell>
              {new Date(price.createdAt).toLocaleDateString("vi-VN")}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default GoldPriceTable;
