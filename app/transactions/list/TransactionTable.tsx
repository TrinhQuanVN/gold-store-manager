import { DateToStringVN, toStringVN } from "@/utils";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { TransactionListView } from "@prisma/client";
export interface TransactionSearchQuery {
  isExport?: string; // sẽ convert sang boolean
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  page?: string;
  pageSize?: string;
  excelFromDate?: string;
  excelToDate?: string;
}

const renderItemDetails = (items?: any[] | null) => {
  if (!items || !Array.isArray(items)) return "";
  return items
    .map((item) => {
      if (!item?.name || typeof item?.weight !== "number") return null;
      return `${toStringVN(item.weight, 0, 4)} chỉ ${item.name}`;
    })
    .filter(Boolean)
    .join("; ");
};

const TransactionTable = ({
  searchParams,
  transactions,
}: {
  searchParams: TransactionSearchQuery;
  transactions: TransactionListView[];
}) => {
  const summary = transactions.reduce(
    (acc, t) => {
      const cash = +(t.cashAmount ?? 0);
      const bank = +(t.bankAmount ?? 0);
      const total = +(t.totalAmount ?? 0);

      const hasExport = t.isExport && (t.goldDetails || t.jewelryDetails);
      const hasImport = !t.isExport && (t.goldDetails || t.jewelryDetails);

      return {
        cash: acc.cash + cash,
        bank: acc.bank + bank,
        totalAmount: acc.totalAmount + total,
        exportCount: acc.exportCount + (hasExport ? 1 : 0),
        importCount: acc.importCount + (hasImport ? 1 : 0),
      };
    },
    { cash: 0, bank: 0, totalAmount: 0, exportCount: 0, importCount: 0 }
  );

  const renderSummaryRow = (label: string) => (
    <Table.Row className="bg-gray-100 font-bold">
      <Table.Cell>{label}</Table.Cell>
      <Table.Cell>-</Table.Cell>
      <Table.Cell>{`Số dòng: ${summary.exportCount}`}</Table.Cell>
      <Table.Cell>{`Số dòng: ${summary.importCount}`}</Table.Cell>
      <Table.Cell>{toStringVN(summary.cash)}</Table.Cell>
      <Table.Cell>{toStringVN(summary.bank)}</Table.Cell>
      <Table.Cell>{toStringVN(summary.totalAmount)}</Table.Cell>
      <Table.Cell>-</Table.Cell>
      <Table.Cell>-</Table.Cell>
    </Table.Row>
  );
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => {
            const isSorted = searchParams.orderBy === column.value;
            const nextOrder =
              isSorted && searchParams.orderDirection === "asc"
                ? "desc"
                : "asc";

            return (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      orderDirection: nextOrder,
                    },
                  }}
                >
                  {column.label}
                </NextLink>
                {isSorted && (
                  <ArrowUpIcon
                    className={`inline transition-transform ml-1 ${
                      searchParams.orderDirection === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Table.ColumnHeaderCell>
            );
          })}
          <Table.ColumnHeaderCell>Hành động</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {renderSummaryRow("Tổng cộng:")}
        {transactions.map((t) => {
          const exportContent = t.isExport
            ? [
                renderItemDetails(t.goldDetails as any[]),
                renderItemDetails(t.jewelryDetails as any[]),
              ]
                .filter(Boolean)
                .join(" | ")
            : "-";

          const importContent = !t.isExport
            ? [
                renderItemDetails(t.goldDetails as any[]),
                renderItemDetails(t.jewelryDetails as any[]),
              ]
                .filter(Boolean)
                .join(" | ")
            : "-";

          const cash = +(t.cashAmount ?? 0);
          const bank = +(t.bankAmount ?? 0);

          return (
            <Table.Row key={t.id}>
              <Table.Cell>
                <Link
                  className=" text-blue-400 hover:text-blue-1000"
                  href={`/transactions/${t.id}`}
                >
                  {DateToStringVN(t.createdAt)}
                </Link>
              </Table.Cell>
              <Table.Cell>
                {t.contactId ? (
                  <Link
                    className=" text-blue-400 hover:text-blue-1000"
                    href={`/contacts/${t.contactId}`}
                  >
                    {t.contactName}
                  </Link>
                ) : (
                  "-"
                )}
              </Table.Cell>
              <Table.Cell>{exportContent}</Table.Cell>
              <Table.Cell>{importContent}</Table.Cell>
              <Table.Cell>{toStringVN(cash)}</Table.Cell>
              <Table.Cell>{toStringVN(bank)}</Table.Cell>
              <Table.Cell>{toStringVN(Number(t.totalAmount))}</Table.Cell>
              <Table.Cell>{t.note || "-"}</Table.Cell>
              <Table.Cell>
                <NextLink
                  href={{
                    pathname: `/transactions/edit/${t.id}`,
                    query: {
                      redirectTo: `/transactions/list?${new URLSearchParams(
                        Object.fromEntries(
                          Object.entries(searchParams).filter(
                            ([_, v]) => v !== undefined && v !== null
                          ) as [string, string][]
                        )
                      ).toString()}`,
                    },
                  }}
                  passHref
                >
                  <Pencil1Icon className="cursor-pointer hover:text-blue-500" />
                </NextLink>
              </Table.Cell>
            </Table.Row>
          );
        })}
        {renderSummaryRow("Tổng cộng:")}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: string;
  className?: string;
}[] = [
  { label: "Ngày", value: "createdAt" },
  { label: "Khách hàng", value: "contact.name" },
  { label: "Xuất", value: "xuat" },
  { label: "Nhập", value: "nhap" },
  { label: "Tiền mặt", value: "cashAmount" },
  { label: "Chuyển khoản", value: "bankAmount" },
  { label: "Tổng tiền", value: "totalAmount" },
  { label: "Ghi chú", value: "note" },
];

export const columnNames = columns.map((column) => column.value);

export default TransactionTable;
