//import { ContactStatusBadge } from '@/app/components'
import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import { DateToStringVN, toStringVN } from "@/utils";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { Pencil1Icon } from "@radix-ui/react-icons";
export interface TransactionSearchQuery {
  isExport?: string; // sẽ convert sang boolean
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  page?: string;
  pageSize?: string;
}

const TransactionTable = ({
  searchParams,
  transactions,
}: {
  searchParams: TransactionSearchQuery;
  transactions: RawTransactionHeaderFormData[];
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
          <Table.ColumnHeaderCell>Hành động</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {transactions.map((t) => {
          const goldExport = t.goldDetails
            .map((g) => `${toStringVN(+g.weight, 0, 4)} chỉ ${g.goldName}`)
            .join("; ");
          const jewelryExport = t.jewelryDetails
            .map((j) => `${toStringVN(+j.weight, 0, 4)} chỉ ${j.jewelryName}`)
            .join("; ");
          const exportContent =
            t.isExport &&
            [goldExport, jewelryExport].filter(Boolean).join(" | ");

          const goldImport = t.goldDetails
            .map((g) => `${toStringVN(+g.weight, 0, 4)} chỉ ${g.goldName}`)
            .join("; ");
          const jewelryImport = t.jewelryDetails
            .map((j) => `${toStringVN(+j.weight, 0, 4)} chỉ ${j.jewelryName}`)
            .join("; ");
          const importContent =
            !t.isExport &&
            [goldImport, jewelryImport].filter(Boolean).join(" | ");

          const cash = t.payments
            .filter((p) => p.type === "TM")
            .reduce((sum, p) => sum + +p.amount, 0);
          const bank = t.payments
            .filter((p) => p.type === "CK")
            .reduce((sum, p) => sum + +p.amount, 0);
          const paymentText = [
            cash ? `Tiền mặt: ${toStringVN(cash)}` : "",
            bank ? `Chuyển khoản: ${toStringVN(bank)}` : "",
          ]
            .filter(Boolean)
            .join(" | ");

          return (
            <Table.Row key={t.id}>
              {/* <Table.Cell>
                <Link
                  className=" text-blue-400 hover:text-blue-1000"
                  href={`/transactions/${t.id}`}
                >
                  {t.id}
                </Link>
              </Table.Cell> */}
              <Table.Cell>
                <Link
                  className=" text-blue-400 hover:text-blue-1000"
                  href={`/transactions/${t.id}`}
                >
                  {DateToStringVN(t.date)}
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
              <Table.Cell>{exportContent || "-"}</Table.Cell>
              <Table.Cell>{importContent || "-"}</Table.Cell>
              <Table.Cell>{paymentText}</Table.Cell>
              <Table.Cell>{toStringVN(+t.totalAmount)}</Table.Cell>
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
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: string;
  className?: string;
}[] = [
  // { label: "Mã GD", value: "id" },
  { label: "Ngày", value: "createdAt" },
  { label: "Khách hàng", value: "contact.name" },
  { label: "Xuất", value: "xuat" },
  { label: "Nhập", value: "nhap" },
  { label: "Thanh toán", value: "payment" },
  { label: "Tổng tiền", value: "totalAmount" },
  { label: "Ghi chú", value: "note" },
];

export const columnNames = columns.map((column) => column.value);

export default TransactionTable;
