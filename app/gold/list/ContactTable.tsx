//import { ContactStatusBadge } from '@/app/components'
import ContactGroupBadge from "@/app/components/ContactGroupBadge";
import { Contact, ContactGroup } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Flex, Table, Text } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { ContactSearchQuery } from "./ContactSearchQuery";

const ContactTable = ({
  searchParams,
  contacts,
}: {
  searchParams: ContactSearchQuery;
  contacts: (Contact & { group: ContactGroup })[];
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
            <Table.Cell>
              <Flex direction="column" gap="2" align="start">
                <Link href={`/contacts/${contact.id}`}>{contact.name}</Link>
                <ContactGroupBadge ContactGroup={contact.group} />
                <Text>
                  Ngày tạo: {contact.createdAt.toLocaleDateString("vn-VN")}
                </Text>
              </Flex>
            </Table.Cell>
            <Table.Cell className="">
              <Flex direction="column" gap="2">
                <Text>Căn cước: {contact.cccd}</Text>
                <Text>Mã số thuế: {contact.taxcode}</Text>
              </Flex>
            </Table.Cell>
            <Table.Cell className="">{contact.address}</Table.Cell>
            <Table.Cell className="">{contact.phone}</Table.Cell>
            <Table.Cell className="">{contact.note}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Contact;
  className?: string;
}[] = [
  { label: "Tên khách hàng", value: "name" },
  {
    label: "Thông tin",
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
    label: "Ghi chú",
    value: "note",
  },
];

export const columnNames = columns.map((column) => column.value);

export default ContactTable;
