"use client";

import { ContactGroupBadge } from "@/app/components";
import { DataList, Flex, Text, Button, Dialog } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Control, Controller, useController } from "react-hook-form";
import { ContactWithGroup } from "@/types";
import axios from "axios";
import dynamic from "next/dynamic";
import { ContactGroup } from "@prisma/client";

const ContactSelect = dynamic(() => import("./ContactSelect"), { ssr: false });
const ContactFormPopup = dynamic(() => import("./ContactFormPopup"), {
  ssr: false,
});

interface Props {
  name: string;
  control: Control<any>;
  contact?: ContactWithGroup | null;
  groups: ContactGroup[];
}

const ContactForm = ({ name, control, contact, groups }: Props) => {
  const {
    field: { value: contactId, onChange },
  } = useController({ name, control, defaultValue: contact?.id ?? "" });

  const [selected, setSelected] = useState<typeof contact | null>(
    contact ?? null
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    if (contact) setSelected(contact);
  }, [contact]);

  return (
    <Flex direction="column" gap="4">
      <Flex gap="3" align="center" className="w-full">
        <div className="flex-1">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <ContactSelect
                value={selected}
                onChange={(contact) => {
                  setSelected(contact);
                  field.onChange(contact.id.toString());
                }}
              />
            )}
          />
        </div>

        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
          <Dialog.Trigger>
            <Button size="2">Thêm khách hàng</Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Thêm khách hàng</Dialog.Title>
            <ContactFormPopup
              groups={groups}
              onSuccess={(newContact) => {
                setSelected(newContact);
                onChange(newContact.id.toString());
                setOpenDialog(false);
              }}
              onCancel={() => setOpenDialog(false)}
            />
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
      <Flex>
        {selected && (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label className="font-bold">
                Tên khách hàng:
              </DataList.Label>
              <DataList.Value>
                <Flex gap="2" align="center">
                  <Text>{selected.name}</Text>
                  <ContactGroupBadge ContactGroup={selected.group} />
                  <Dialog.Root
                    open={openEditDialog}
                    onOpenChange={setOpenEditDialog}
                  >
                    <Dialog.Trigger>
                      <Button
                        size="1"
                        variant="soft"
                        aria-label="Sửa khách hàng"
                        className="hover:bg-gray-500 transition-colors"
                      >
                        ✏️
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Content maxWidth="450px">
                      <Dialog.Title>Sửa thông tin khách hàng</Dialog.Title>
                      <ContactFormPopup
                        contact={selected}
                        groups={groups}
                        onSuccess={(updatedContact) => {
                          setSelected(updatedContact);
                          onChange(updatedContact.id.toString());
                          setOpenEditDialog(false);
                        }}
                        onCancel={() => setOpenEditDialog(false)}
                      />
                    </Dialog.Content>
                  </Dialog.Root>
                </Flex>
              </DataList.Value>
            </DataList.Item>

            {selected.phone && (
              <DataList.Item>
                <DataList.Label className="font-bold">
                  Số điện thoại:
                </DataList.Label>
                <DataList.Value>{selected.phone}</DataList.Value>
              </DataList.Item>
            )}

            {selected.cccd && (
              <DataList.Item>
                <DataList.Label className="font-bold">Căn cước:</DataList.Label>
                <DataList.Value>{selected.cccd}</DataList.Value>
              </DataList.Item>
            )}

            {selected.address && (
              <DataList.Item>
                <DataList.Label className="font-bold">Địa chỉ:</DataList.Label>
                <DataList.Value>{selected.address}</DataList.Value>
              </DataList.Item>
            )}

            {selected.taxcode && (
              <DataList.Item>
                <DataList.Label className="font-bold">
                  Mã số thuế
                </DataList.Label>
                <DataList.Value>{selected.taxcode}</DataList.Value>
              </DataList.Item>
            )}

            {selected.note && (
              <DataList.Item>
                <DataList.Label className="font-bold">Ghi chú:</DataList.Label>
                <DataList.Value>{selected.note}</DataList.Value>
              </DataList.Item>
            )}
          </DataList.Root>
        )}
      </Flex>
    </Flex>
  );
};

export default ContactForm;
