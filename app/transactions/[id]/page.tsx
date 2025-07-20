import { prisma } from "@/prisma/client";
import DeleteTransactionButton from "./DeleteTransactionButton";
import EditTransactionButton from "./EditTransactionButton";
import { transactionWithRelation } from "@/types";
import { Grid, Box, Flex } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import TransactionDetail from "./TransactionDetail";
import { convertPrismaTransactionHeaderWithRelationToString } from "@/prismaRepositories/StringConverted";
import { toStringVN } from "@/utils";

interface Props {
  params: { id: string };
}

// const fetchUser = cache((ContactId: number) =>
//   prisma.Contact.findUnique({ where: { id: ContactId } })
// );

const TransactionDetailPage = async ({ params }: Props) => {
  //   const session = await getServerSession(authOptions);
  //   const Contact = await fetchUser(parseInt(params.id));
  const _params = await params;

  const transaction = await prisma.transactionHeader.findUnique({
    where: { id: parseInt(_params.id) },
    ...transactionWithRelation,
  });
  if (!transaction) notFound();

  const goldTotal = transaction.goldTransactionDetails.reduce(
    (sum, g) => sum + Number(g.amount ?? 0),
    0
  );
  const jewelryTotal = transaction.jewelryTransactionDetails.reduce(
    (sum, j) => sum + Number(j.amount ?? 0),
    0
  );

  const converted = {
    ...convertPrismaTransactionHeaderWithRelationToString(transaction),
    totalAmount: goldTotal + jewelryTotal,
  };

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <TransactionDetail transaction={converted} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditTransactionButton transactionId={transaction.id} />
          <DeleteTransactionButton transactionId={transaction.id} />
        </Flex>
      </Box>
    </Grid>
  );
};

// export async function generateMetadata({ params }: Props) {
//   const Contact = await fetchUser(parseInt(params.id));

//   return {
//     title: Contact?.title,
//     description: "Details of Contact " + Contact?.id,
//   };
// }

export default TransactionDetailPage;
