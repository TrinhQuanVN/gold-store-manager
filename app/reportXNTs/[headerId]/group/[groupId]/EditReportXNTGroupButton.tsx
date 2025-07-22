import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditReportXNTGroupButton = ({
  headerId,
  groupId,
}: {
  headerId: number;
  groupId: number;
}) => {
  return (
    <Button asChild>
      <Link href={`/reportXNTs/${headerId}/group/edit/${groupId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa</span>
      </Link>
    </Button>
  );
};

export default EditReportXNTGroupButton;
