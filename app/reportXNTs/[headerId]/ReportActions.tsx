import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const ReportActions = ({ reportHeaderId }: { reportHeaderId: number }) => {
  return (
    <Flex justify="between">
      <Button>
        <Link href={`/reportXNTs/${reportHeaderId}/report/new`}>
          Thêm mới chi tiết
        </Link>
      </Button>
    </Flex>
  );
};

export default ReportActions;
