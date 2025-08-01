import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const JewelryActions = () => {
  return (
    <Flex justify="end">
      <Button>
        <Link href="/jewelry/new">Thêm trang sức</Link>
      </Button>
    </Flex>
  );
};

export default JewelryActions;
