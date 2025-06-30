"use client";

import { Contact, ContactGroup } from "@prisma/client";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import ContactSelect from "./ContactSelect";
import { Button, Flex, Text } from "@radix-ui/themes";
import { ContactGroupBadge } from "@/app/components";

interface Props {
  contacts: (Contact & { group: ContactGroup })[];
  onSelect?: (contact: Contact) => void;
}

const ContactForm = ({ contacts }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<
    (Contact & { group: ContactGroup }) | null
  >(null);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-4">
      <Collapsible.Trigger asChild>
        <Button variant="outline">
          {open ? "Ẩn thông tin liên hệ" : "Chọn liên hệ"}
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content className="mt-4 space-y-4">
        <Flex direction="column" gap="4">
          <ContactSelect
            contacts={contacts}
            value={selected}
            onChange={(contact) => {
              setSelected(contact);
            }}
          />

          {selected && (
            <Flex
              direction="column"
              gap="2"
              className="p-3 bg-gray-50 rounded-md"
            >
              <Text>
                <b>Tên khách hàng:</b> {selected.name}
              </Text>
              <ContactGroupBadge ContactGroup={selected.group} />
              {selected.phone && (
                <Text>
                  <b>Số điện thoại:</b> {selected.phone}
                </Text>
              )}
              {selected.cccd && (
                <Text>
                  <b>Căn cước:</b> {selected.cccd}
                </Text>
              )}
              {selected.address && (
                <Text>
                  <b>Địa chỉ:</b> {selected.address}
                </Text>
              )}
              {selected.taxcode && (
                <Text>
                  <b>mã số thuế:</b> {selected.taxcode}
                </Text>
              )}
              {selected.note && (
                <Text>
                  <b>Ghi chú:</b> {selected.note}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ContactForm;
