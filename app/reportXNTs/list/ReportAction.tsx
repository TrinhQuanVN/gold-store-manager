import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const ReportAction = () => {
  return (
    <Flex justify="between">
      <Button>
        <Link href="/reportXNTs/new">Thêm mới báo cáo</Link>
      </Button>
    </Flex>
  );
};

export default ReportAction;
