import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditContactButton = ({ ContactId }: { ContactId: number }) => {
  return (
    <Button asChild>
      <Link href={`/contacts/edit/${ContactId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa</span>
      </Link>
    </Button>
  );
};

export default EditContactButton;
