import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { transactionWithRelation } from "@/types";
import { Flex } from "@radix-ui/themes";
import { converttoRawTransactionHeaderFormData } from "../_components/convertToRaw";
import TransactionActions from "./TransactionActions";
import TransactionTable, {
  columnNames,
  TransactionSearchQuery,
} from "./TransactionTable";
import TransactionSearchForm from "./TransactionSearchForm";

interface Props {
  searchParams: TransactionSearchQuery;
}

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
    console.log("params.startDate", params.startDate);
    console.log("params.endDate", params.endDate);
    where.createdAt = {};
    if (params.startDate) {
      where.createdAt.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      where.createdAt.lte = new Date(params.endDate);
    }
  }

  const transactions = await prisma.transactionHeader.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy ?? "")
      ? [{ [params.orderBy!]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    ...transactionWithRelation,
  });

  const allTransactions = await prisma.transactionHeader.findMany({
    orderBy: columnNames.includes(params.orderBy ?? "")
      ? [{ [params.orderBy!]: orderDirection }, { createdAt: "asc" }]
      : [{ createdAt: "asc" }],
    ...transactionWithRelation,
  });

  const transactionCount = await prisma.transactionHeader.count({
    where,
  });

  return (
    <Flex direction="column" gap="3">
      <TransactionSearchForm searchParams={params} />
      <TransactionActions
        transactions={allTransactions.map(
          converttoRawTransactionHeaderFormData
        )}
      />
      <TransactionTable
        searchParams={params}
        transactions={transactions.map(converttoRawTransactionHeaderFormData)}
      />
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

// export const metadata: Metadata = {
//   title: "Contact Tracker - Contact List",
//   description: "View all project Contacts",
// };

export default TransactionPage;
