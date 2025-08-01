// app/payments/PaymentTable.tsx
// "use client";

import { Table } from "@radix-ui/themes";
import { toDateStringVn, toStringVN } from "@/utils/formatVnNumber";
import { default as Link, default as NextLink } from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

export interface PaymentSummaryRow {
  date: string; // yyyy-MM-dd
  transactionId: number;
  xuatTM: number;
  xuatCK: number;
  nhapTM: number;
  nhapCK: number;
}

export interface PaymentQuery {
  orderBy?: keyof PaymentSummaryRow;
  orderDirection?: "asc" | "desc";
  page?: string;
  pageSize?: string;
}

interface Props {
  data: PaymentSummaryRow[];
  searchParams: PaymentQuery;
}

const PaymentTable = ({ data, searchParams }: Props) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell
            rowSpan={2}
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Ngày
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            colSpan={2}
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            Xuất
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} style={{ textAlign: "center" }}>
            Nhập
          </Table.ColumnHeaderCell>
        </Table.Row>
        <Table.Row>
          <SortableHeaderCell
            label="Tiền mặt"
            columnKey="xuatTM"
            searchParams={searchParams}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          />
          <SortableHeaderCell
            label="Chuyển khoản"
            columnKey="xuatCK"
            searchParams={searchParams}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          />
          <SortableHeaderCell
            label="Tiền mặt"
            columnKey="nhapTM"
            searchParams={searchParams}
            style={{
              verticalAlign: "middle",
              borderRight: "1px solid #e5e7eb",
            }}
          />
          <SortableHeaderCell
            label="Chuyển khoản"
            columnKey="nhapCK"
            searchParams={searchParams}
          />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((row) => (
          <Table.Row key={`${row.transactionId}-${row.date}`}>
            <Table.Cell style={{ textAlign: "center" }}>
              <Link href={`/transactions/${row.transactionId}`}>
                {toDateStringVn(row.date)}
              </Link>
            </Table.Cell>
            <Table.Cell style={{ textAlign: "center" }}>
              {toStringVN(row.xuatTM)}
            </Table.Cell>
            <Table.Cell style={{ textAlign: "center" }}>
              {toStringVN(row.xuatCK)}
            </Table.Cell>
            <Table.Cell style={{ textAlign: "center" }}>
              {toStringVN(row.nhapTM)}
            </Table.Cell>
            <Table.Cell style={{ textAlign: "center" }}>
              {toStringVN(row.nhapCK)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default PaymentTable;

export const columnNames: (keyof PaymentSummaryRow)[] = [
  "date",
  "xuatTM",
  "xuatCK",
  "nhapTM",
  "nhapCK",
];

const SortableHeaderCell = ({
  label,
  columnKey,
  searchParams,
  style,
}: {
  label: string;
  columnKey: keyof PaymentSummaryRow;
  searchParams: PaymentQuery;
  style?: React.CSSProperties;
}) => {
  const direction =
    searchParams.orderBy === columnKey
      ? searchParams.orderDirection
      : undefined;

  const nextDirection = direction === "asc" || !direction ? "desc" : "asc";

  return (
    <Table.ColumnHeaderCell style={{ textAlign: "center", ...style }}>
      <Link
        href={{
          query: {
            ...searchParams,
            orderBy: columnKey,
            orderDirection: nextDirection,
          },
        }}
      >
        {label}
      </Link>
      {direction && (
        <ArrowUpIcon
          className={`inline ml-1 transition-transform ${
            direction === "desc" ? "rotate-180" : ""
          }`}
        />
      )}
    </Table.ColumnHeaderCell>
  );
};
