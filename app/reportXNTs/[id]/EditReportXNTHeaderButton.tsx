import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditReportXNTHeaderButton = ({ headerId }: { headerId: number }) => {
  return (
    <Button asChild>
      <Link href={`/reportXNTs/edit/${headerId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa báo cáo</span>
      </Link>
    </Button>
  );
};

export default EditReportXNTHeaderButton;
