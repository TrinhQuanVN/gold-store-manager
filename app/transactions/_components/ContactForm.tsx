"use client";

import { Contact, ContactGroup } from "@prisma/client";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import ContactSelect from "./ContactSelect";
import { Button, DataList, Flex, Text } from "@radix-ui/themes";
import { ContactGroupBadge } from "@/app/components";
import CustomCollapsible from "@/app/components/CustomCollapsible";

interface Props {
  value?: (Contact & { group: ContactGroup }) | null;
  onChange?: (contact: Contact & { group: ContactGroup }) => void;
}

const ContactForm = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const selected = value;

  return (
    <CustomCollapsible
      title={
        selected
          ? `Lựa chọn khách hàng: ${selected.name}`
          : "Lựa chọn khách hàng"
      }
    >
      <Flex direction="column" gap="4">
        <ContactSelect
          value={selected}
          onChange={(contact) => {
            onChange?.(contact); // Gọi lên parent
          }}
        />

        {selected && (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Tên khách hàng</DataList.Label>
              <DataList.Value>
                <Flex gap="2">
                  <Text>{selected.name}</Text>
                  <ContactGroupBadge ContactGroup={selected.group} />
                </Flex>
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
