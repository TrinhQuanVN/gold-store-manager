import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
//import ContactStatusFilter from "./ContactStatusFilter";

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
