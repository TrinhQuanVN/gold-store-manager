// "use client";

import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import ExportExcelDialog from "./ExportExcelDialog";
import { TransactionSearchQuery } from "./TransactionTable";

interface Props {
  searchParams: TransactionSearchQuery;
}

const TransactionActions = ({ searchParams }: Props) => {
  return (
    <Flex justify="end" gap="3">
      <Button asChild>
        <Link href="/transactions/new">Thêm giao dịch</Link>
      </Button>
      <ExportExcelDialog searchParams={searchParams} />
    </Flex>
  );
};

export default TransactionActions;
