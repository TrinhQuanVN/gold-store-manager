import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const TransactionActions = () => {
  return (
    <Flex justify="between">
      <Button>
        <Link href="/transactions/new">Thêm giao dịch</Link>
      </Button>
    </Flex>
  );
};

export default TransactionActions;
