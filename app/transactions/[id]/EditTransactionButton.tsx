import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditTransactionButton = ({
  transactionId,
}: {
  transactionId: number;
}) => {
  return (
    <Button asChild>
      <Link href={`/transactions/edit/${transactionId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa</span>
      </Link>
    </Button>
  );
};

export default EditTransactionButton;
