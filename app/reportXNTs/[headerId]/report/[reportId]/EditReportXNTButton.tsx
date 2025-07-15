import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditReportXNTButton = ({
  headerId,
  reportId,
}: {
  headerId: number;
  reportId: string;
}) => {
  return (
    <Button asChild>
      <Link href={`/reportXNTs/${headerId}/report/edit/${reportId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa</span>
      </Link>
    </Button>
  );
};

export default EditReportXNTButton;
