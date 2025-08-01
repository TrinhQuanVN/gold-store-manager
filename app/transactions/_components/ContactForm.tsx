"use client";

import { ContactGroupBadge } from "@/app/components";
import {
  RawContactDataForm,
  RawTransactionHeaderFormData,
} from "@/app/validationSchemas";
import { ContactWithGroup } from "@/types";
import { Button, DataList, Flex, Text } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { default as Link } from "next/link";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";

const ContactSelect = dynamic(() => import("./ContactSelect"), { ssr: false });

interface Props {
  // contactGroup: ContactWithGroup[];
  control: Control<RawTransactionHeaderFormData>;
}

const ContactForm = ({ control }: Props) => {
  const [contact, setContact] = useState<RawContactDataForm | null>(null);

  return (
    <Flex direction="column" gap="4">
      <Flex gap="3" align="center" className="w-full">
        <div className="flex-1">
          <Controller
            name="contactId"
            control={control}
            render={({ field }) => (
              <ContactSelect
                value={field.value}
                onChange={(contactId) => field.onChange(contactId)}
                onContactChange={(contact) => {
                  setContact(contact);
                }}
              />
            )}
          />
        </div>

        <Button size="2" asChild>
          <Link
            className=""
            href={`/contacts/new?redirectTo=/transactions/new`}
          >
            Thêm khách hàng
          </Link>
        </Button>
      </Flex>

      {contact && (
        <Flex>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label className="font-bold">
                Tên khách hàng:
              </DataList.Label>
              <DataList.Value>
                <Flex gap="2" align="center">
                  <Text>{contact.name}</Text>
                  <ContactGroupBadge
                    group={{
                      name: contact.group?.name ?? "",
                      color: contact.group?.color ?? "gray",
                    }}
                  />
                  <Button
                    size="1"
                    variant="soft"
                    aria-label="Sửa khách hàng"
                    asChild
                  >
                    <Link
                      className=""
                      href={`/contacts/edit/${contact.id}?redirectTo=/transactions/new`}
                    >
                      ✏️
                    </Link>
                  </Button>
                </Flex>
              </DataList.Value>
            </DataList.Item>

            {contact.phone && (
              <DataList.Item>
                <DataList.Label className="font-bold">
                  Số điện thoại:
                </DataList.Label>
                <DataList.Value>{contact.phone}</DataList.Value>
              </DataList.Item>
            )}

            {contact.cccd && (
              <DataList.Item>
                <DataList.Label className="font-bold">Căn cước:</DataList.Label>
                <DataList.Value>{contact.cccd}</DataList.Value>
              </DataList.Item>
            )}

            {contact.address && (
              <DataList.Item>
                <DataList.Label className="font-bold">Địa chỉ:</DataList.Label>
                <DataList.Value>{contact.address}</DataList.Value>
              </DataList.Item>
            )}

            {contact.taxcode && (
              <DataList.Item>
                <DataList.Label className="font-bold">
                  Mã số thuế:
                </DataList.Label>
                <DataList.Value>{contact.taxcode}</DataList.Value>
              </DataList.Item>
            )}

            {contact.note && (
              <DataList.Item>
                <DataList.Label className="font-bold">Ghi chú:</DataList.Label>
                <DataList.Value>{contact.note}</DataList.Value>
              </DataList.Item>
            )}
          </DataList.Root>
        </Flex>
      )}
    </Flex>
  );
};

export default ContactForm;
