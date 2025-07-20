import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { convertPrismaTransactionHeaderWithRelationToString } from "@/prismaRepositories/StringConverted";
import { transactionWithRelation } from "@/types";
import { toStringVN } from "@/utils";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { Flex } from "@radix-ui/themes";
import { ContactSearchQuery } from "./ContactSearchQuery";
import TransactionActions from "./TransactionActions";
import TransactionTable, { columnNames } from "./TransactionTable";
interface Props {
  searchParams: ContactSearchQuery;
}

const TransactionPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";

  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  const where = {
    ...(params.name && {
      OR: [
        { name: { contains: params.name } },
        {
          unaccentName: {
            contains: toLowerCaseNonAccentVietnamese(params.name),
          },
        },
      ],
    }),
    ...(params.cccd && {
      cccd: { contains: params.cccd },
    }),
    ...(params.phone && {
      phone: { contains: params.phone },
    }),
  };

  const transactions = await prisma.transactionHeader.findMany({
    // where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    ...transactionWithRelation,
  });

  const transactionCount = await prisma.transactionHeader.count({
    // where,
  });

  const transactionsWithTotalAmount = transactions.map((t) => {
    const converted = convertPrismaTransactionHeaderWithRelationToString(t);

    const goldTotal = t.goldTransactionDetails.reduce(
      (sum, g) => sum + Number(g.amount ?? 0),
      0
    );
    const jewelryTotal = t.jewelryTransactionDetails.reduce(
      (sum, j) => sum + Number(j.amount ?? 0),
      0
    );

    return {
      ...converted,
      totalAmount: goldTotal + jewelryTotal,
    };
  });

  return (
    <Flex direction="column" gap="3">
      <TransactionActions />
      {/* <ContactSearchForm searchParams={params} /> */}
      <TransactionTable
        searchParams={params}
        transactions={transactionsWithTotalAmount}
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
