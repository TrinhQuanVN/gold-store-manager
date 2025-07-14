import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { Prisma } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import TransactionActions from "./TransactionActions";
import ContactSearchForm from "./ContactSearchForm";
import TransactionTable, { columnNames } from "./TransactionTable";
import { ContactSearchQuery } from "./ContactSearchQuery";
import { transactionWithRelation } from "@/types";
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

  return (
    <Flex direction="column" gap="3">
      <TransactionActions />
      {/* <ContactSearchForm searchParams={params} /> */}
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

// export const metadata: Metadata = {
//   title: "Contact Tracker - Contact List",
//   description: "View all project Contacts",
// };

export default TransactionPage;
