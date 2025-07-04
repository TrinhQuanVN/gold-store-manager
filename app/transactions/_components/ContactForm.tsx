"use client";

import { ContactGroupBadge } from "@/app/components";
import CustomCollapsible from "@/app/components/CustomCollapsible";
import { Contact, ContactGroup } from "@prisma/client";
import { DataList, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ContactSelect from "./ContactSelect";
import {
  Control,
  Controller,
  FieldErrors,
  useController,
} from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage";

interface Props {
  name: string;
  control: Control<any>; // hoặc Control<RawTransactionDataForm>
  contact?: Contact & { group: ContactGroup }; // optional, truyền khi edit
}

const ContactForm = ({ name, control, contact }: Props) => {
  const {
    field: { value: contactId, onChange },
    fieldState: { error },
  } = useController({ name, control, defaultValue: contact?.id ?? "" });

  const [selected, setSelected] = useState<typeof contact | null>(
    contact ?? null
  );

  useEffect(() => {
    if (contact) setSelected(contact);
  }, [contact]);

  return (
    <CustomCollapsible
      title={
        selected
          ? `Lựa chọn khách hàng: ${selected.name}`
          : "Lựa chọn khách hàng"
      }
    >
      <Flex direction="column" gap="4">
        <Controller
          name={name}
          control={control}
          defaultValue={contact?.id ?? ""}
          render={({ field }) => (
            <ContactSelect
              value={selected}
              onChange={(contact) => {
                setSelected(contact);
                field.onChange(contact.id.toString()); // ✅ dùng contact.id để cập nhật react-hook-form
              }}
            />
          )}
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
