import { prisma } from "@/prisma/client";
import DeleteTransactionButton from "./DeleteTransactionButton";
import EditTransactionButton from "./EditTransactionButton";
import { transactionWithRelation } from "@/types";
import { Grid, Box, Flex } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import TransactionDetail from "./TransactionDetail";

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

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <TransactionDetail transaction={transaction} />
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
