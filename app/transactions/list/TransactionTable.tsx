//import { ContactStatusBadge } from '@/app/components'
import ContactGroupBadge from "@/app/components/ContactGroupBadge";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { ContactSearchQuery } from "./ContactSearchQuery";
import { TransactionHeaderWithRelation } from "@/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const TransactionTable = ({
  searchParams,
  transactions,
}: {
  searchParams: ContactSearchQuery;
  transactions: TransactionHeaderWithRelation[];
}) => {
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
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {transactions.map((t) => {
          const goldExport = t.goldTransactionDetails
            .map((g) => `${g.gold.name} × ${g.weight}`)
            .join(", ");
          const jewelryExport = t.jewelryTransactionDetails
            .map((j) => `${j.jewelry.name} × ${j.jewelry.goldWeight}`)
            .join(", ");
          const exportContent =
            t.isExport &&
            [goldExport, jewelryExport].filter(Boolean).join(" | ");

          const goldImport = t.goldTransactionDetails
            .map((g) => `${g.gold.name} × ${g.weight}`)
            .join(", ");
          const jewelryImport = t.jewelryTransactionDetails
            .map((j) => `${j.jewelry.name} × ${j.jewelry.goldWeight}`)
            .join(", ");
          const importContent =
            !t.isExport &&
            [goldImport, jewelryImport].filter(Boolean).join(" | ");

          const cash = t.paymentAmounts
            .filter((p) => p.type === "CASH")
            .reduce((sum, p) => sum + p.amount, 0);
          const bank = t.paymentAmounts
            .filter((p) => p.type === "BANK")
            .reduce((sum, p) => sum + p.amount, 0);
          const paymentText = [
            cash ? `Tiền mặt: ${cash.toLocaleString("vi-VN")}` : "",
            bank ? `Chuyển khoản: ${bank.toLocaleString("vi-VN")}` : "",
          ]
            .filter(Boolean)
            .join(" | ");

          return (
            <Table.Row key={t.id}>
              <Table.Cell>{t.id}</Table.Cell>
              <Table.Cell>
                {format(new Date(t.createdAt), "dd/MM/yy", { locale: vi })}
              </Table.Cell>
              <Table.Cell>
                {t.contact ? (
                  <Link href={`/contacts/${t.contact.id}`}>
                    {t.contact.name}
                  </Link>
                ) : (
                  "-"
                )}
              </Table.Cell>
              <Table.Cell>{exportContent || "-"}</Table.Cell>
              <Table.Cell>{importContent || "-"}</Table.Cell>
              <Table.Cell>{paymentText}</Table.Cell>
              <Table.Cell>
                {t.totalAmount.toLocaleString("vi-VN", {
                  maximumFractionDigits: 0,
                })}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: string;
  className?: string;
}[] = [
  { label: "Mã GD", value: "id" },
  { label: "Ngày", value: "createdAt" },
  { label: "Khách hàng", value: "contact.name" },
  { label: "Xuất", value: "xuat" },
  { label: "Nhập", value: "nhap" },
  { label: "Thanh toán", value: "payment" },
  { label: "Tổng tiền", value: "totalAmount" },
];

export const columnNames = columns.map((column) => column.value);

export default TransactionTable;
