import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const ContactActions = () => {
  return (
    <Flex justify="between">
      <Button>
        <Link href="/contacts/new">Thêm khách hàng</Link>
      </Button>
    </Flex>
  );
};

export default ContactActions;
