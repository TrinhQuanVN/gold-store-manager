import { prisma } from "@/prisma/client";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ContactDetail from "../ContactDetail";
import DeleteContactButton from "../DeleteContactButton";
import EditContactButton from "../EditContactButton";
import TransactionTable from "@/app/transactions/list/TransactionTable";
import { toStringVN } from "@/utils";

interface Props {
  params: { id: string };
}

const ContactTransactionsPage = async ({ params }: Props) => {
  const _params = await params;
  const contactId = parseInt(_params.id);
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { group: true },
  });

  if (!contact) notFound();

  const transactions = await prisma.transactionListView.findMany({
    where: { contactId },
    orderBy: { createdAt: "desc" },
  });

  // Tính tổng
  const summary = transactions.reduce(
    (acc, t) => {
      const cash = Number(t.cashAmount ?? 0);
      const bank = Number(t.bankAmount ?? 0);
      const total = Number(t.totalAmount ?? 0);

      acc.cash += cash;
      acc.bank += bank;
      acc.total += total;

      return acc;
    },
    { cash: 0, bank: 0, total: 0 }
  );

  return (
    <Flex direction="column" gap="6">
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="md:col-span-4">
          <ContactDetail contact={contact} />
        </Box>
        <Box>
          <Flex direction="column" gap="4">
            <EditContactButton ContactId={contact.id} />
            <DeleteContactButton ContactId={contact.id} />
          </Flex>
        </Box>
      </Grid>

      <Text size="5" weight="bold">
        Danh sách giao dịch
      </Text>

      <TransactionTable searchParams={{}} transactions={transactions} />
    </Flex>
  );
};

export default ContactTransactionsPage;
