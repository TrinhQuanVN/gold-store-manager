import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditJewelryButton = ({ jewelryId }: { jewelryId: number }) => {
  return (
    <Button asChild>
      <Link href={`/jewelry/edit/${jewelryId}`}>
        <Pencil2Icon />
        <span className="ml-2">Sửa</span>
      </Link>
    </Button>
  );
};

export default EditJewelryButton;
