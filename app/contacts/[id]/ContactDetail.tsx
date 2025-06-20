"use client";

import { Card, Flex, Text, Heading } from "@radix-ui/themes";
import { Contact, ContactGroup } from "@prisma/client";
import { ContactGroupBadge } from "@/app/components";
import React from "react";

interface Props {
  contact: Contact & { group: ContactGroup };
}

const ContactDetail = ({ contact }: Props) => {
  return (
    <Card size="3" style={{ maxWidth: 600 }}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="5">{contact.name}</Heading>
          <ContactGroupBadge ContactGroup={contact.group} />
        </Flex>

        <Flex direction="column" gap="2">
          <Text>
            <strong>Căn cước:</strong> {contact.cccd || "Chưa có"}
          </Text>
          <Text>
            <strong>Địa chỉ:</strong> {contact.address || "Chưa có"}
          </Text>
          <Text>
            <strong>Điện thoại:</strong> {contact.phone || "Chưa có"}
          </Text>
          <Text>
            <strong>Mã số thuế:</strong> {contact.taxcode || "Chưa có"}
          </Text>
          <Text>
            <strong>Ghi chú:</strong> {contact.note || "Không có"}
          </Text>
          <Text size="1" color="gray">
            Tạo lúc: {contact.createdAt.toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ContactDetail;
