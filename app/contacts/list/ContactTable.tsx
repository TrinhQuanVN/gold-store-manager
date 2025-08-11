//import { ContactStatusBadge } from '@/app/components'
import ContactGroupBadge from "@/app/components/ContactGroupBadge";
import { Contact, ContactGroup, ContactListView } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { ContactSearchQuery } from "./ContactSearchQuery";
import { toStringVN } from "@/utils";

const ContactTable = ({
  searchParams,
  contacts,
}: {
  searchParams: ContactSearchQuery;
  contacts: ContactListView[];
}) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                    orderDirection:
                      searchParams.orderBy === column.value &&
                      searchParams.orderDirection === "asc"
                        ? "desc"
                        : "asc",
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon
                  className={`inline transition-transform ${
                    searchParams.orderDirection === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {contacts.map((contact) => (
          <Table.Row key={contact.id}>
            <Table.Cell className="">{contact.id}</Table.Cell>
            <Table.Cell>
              <Flex direction="column" gap="2" align="start">
                <Link href={`/contacts/${contact.id}`}>{contact.name}</Link>
                <ContactGroupBadge
                  group={{
                    name: contact.groupName,
                    color: contact.groupColor,
                  }}
                />
              </Flex>
            </Table.Cell>
            <Table.Cell className="">
              <Text>{contact.cccd}</Text>
            </Table.Cell>
            <Table.Cell className="">{contact.address}</Table.Cell>
            <Table.Cell className="">{contact.phone}</Table.Cell>
            <Table.Cell className="">
              {+contact.importValue > 0
                ? toStringVN(+contact.importValue)
                : "-"}
            </Table.Cell>
            <Table.Cell className="">
              {+contact.exportValue > 0
                ? toStringVN(+contact.exportValue)
                : "-"}
            </Table.Cell>
            <Table.Cell className="">{contact.note}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof ContactListView;
  className?: string;
}[] = [
  { label: "Id", value: "id" },
  { label: "Tên khách hàng", value: "name" },
  {
    label: "Căn cước",
    value: "cccd",
  },
  {
    label: "Địa chỉ",
    value: "address",
  },
  {
    label: "Điện thoại",
    value: "phone",
  },
  {
    label: "Khách bán",
    value: "importValue",
  },
  {
    label: "Khách mua",
    value: "exportValue",
  },
  {
    label: "Ghi chú",
    value: "note",
  },
];

export const columnNames = columns.map((column) => column.value);

export default ContactTable;
