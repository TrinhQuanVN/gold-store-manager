"use client";

import { Contact, ContactGroup } from "@prisma/client";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import ContactSelect from "./ContactSelect";
import { Button, DataList, Flex, Text } from "@radix-ui/themes";
import { ContactGroupBadge } from "@/app/components";
import CustomCollapsible from "@/app/components/CustomCollapsible";

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
    <CustomCollapsible title="Lựa chọn khách hàng">
      <Flex direction="column" gap="4">
        <ContactSelect
          contacts={contacts}
          value={selected}
          onChange={(contact) => {
            setSelected(contact);
          }}
        />

        {selected && (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Tên khách hàng</DataList.Label>
              <DataList.Value>{selected.name}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Nhóm</DataList.Label>
              <DataList.Value>
                <ContactGroupBadge ContactGroup={selected.group} />
              </DataList.Value>
            </DataList.Item>

            {selected.phone && (
              <DataList.Item>
                <DataList.Label>SĐT</DataList.Label>
                <DataList.Value>{selected.phone}</DataList.Value>
              </DataList.Item>
            )}

            {selected.cccd && (
              <DataList.Item>
                <DataList.Label>CCCD</DataList.Label>
                <DataList.Value>{selected.cccd}</DataList.Value>
              </DataList.Item>
            )}

            {selected.address && (
              <DataList.Item>
                <DataList.Label>Địa chỉ</DataList.Label>
                <DataList.Value>{selected.address}</DataList.Value>
              </DataList.Item>
            )}

            {selected.taxcode && (
              <DataList.Item>
                <DataList.Label>Mã số thuế</DataList.Label>
                <DataList.Value>{selected.taxcode}</DataList.Value>
              </DataList.Item>
            )}

            {selected.note && (
              <DataList.Item>
                <DataList.Label>Ghi chú</DataList.Label>
                <DataList.Value>{selected.note}</DataList.Value>
              </DataList.Item>
            )}
          </DataList.Root>
        )}
      </Flex>
    </CustomCollapsible>
  );
};

export default ContactForm;
