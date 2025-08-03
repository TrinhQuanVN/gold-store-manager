import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import TransactionActions from "./TransactionActions";
import TransactionTable, {
  columnNames,
  TransactionSearchQuery,
} from "./TransactionTable";
import TransactionSearchForm from "./TransactionSearchForm";
import { TransactionListView } from "@prisma/client";
import { DateToStringVN, toStringVN } from "@/utils";

interface Props {
  searchParams: TransactionSearchQuery;
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

const TransactionPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "10");

  const where: any = {};

  if (params.isExport !== undefined) {
    where.isExport = params.isExport === "true";
  }

  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) {
      where.createdAt.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      where.createdAt.lte = new Date(params.endDate);
    }
  }

  const transactions: TransactionListView[] =
    await prisma.transactionListView.findMany({
      where,
      orderBy: columnNames.includes(params.orderBy ?? "")
        ? [{ [params.orderBy!]: orderDirection }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

  const allTransactions = await prisma.transactionListView.findMany({
    orderBy: columnNames.includes(params.orderBy ?? "")
      ? [{ [params.orderBy!]: orderDirection }, { createdAt: "asc" }]
      : [{ createdAt: "asc" }],
  });

  const transactionCount = await prisma.transactionListView.count({
    where,
  });

  return (
    <Flex direction="column" gap="3">
      <TransactionSearchForm searchParams={params} />
      <TransactionActions
        transactions={allTransactions.map((t) => ({
          id: t.id,
          createdAt: DateToStringVN(t.createdAt) ?? DateToStringVN(new Date()),
          note: t.note ?? "",
          isExport: t.isExport ?? false,
          contactName: t.contactName ?? "-",
          goldAmount: toStringVN(Number(t.goldAmount) ?? 0),
          jewelryAmount: toStringVN(Number(t.jewelryAmount) ?? 0),
          totalAmount: toStringVN(Number(t.totalAmount) ?? 0),
          goldItems: renderItemDetails(t.goldDetails as any[]),
          jewelryItems: renderItemDetails(t.jewelryDetails as any[]),
          cashAmount: toStringVN(Number(t.cashAmount) ?? 0),
          bankAmount: toStringVN(Number(t.bankAmount) ?? 0),
        }))}
      />
      <TransactionTable searchParams={params} transactions={transactions} />
      <Flex gap="2">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={transactionCount}
        />
      </Flex>
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export default TransactionPage;
