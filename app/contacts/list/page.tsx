import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
//import { Status } from '@prisma/client';
import ContactActions from "./ContactActions";
import ContactTable, { ContactQuery, columnNames } from "./ContactTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import PageSizeSelector from "./PageSizeSelector";
import ContactSearchForm from "./ContactSearchForm";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
interface Props {
  searchParams: ContactQuery;
}

const ContactsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";

  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  const field = params.field; // "name" | "cccd" | "phone"
  const keyword = field ? params.value : undefined;

  const where: Prisma.ContactWhereInput =
    field && keyword
      ? field === "name"
        ? {
            OR: [
              { name: { contains: keyword } },
              {
                unaccentName: {
                  contains: toLowerCaseNonAccentVietnamese(keyword),
                },
              },
            ],
          }
        : {
            [field]: {
              contains: keyword,
            },
          }
      : {};

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      group: true,
    },
  });

  const contactCount = await prisma.contact.count({
    where,
  });

  return (
    <Flex direction="column" gap="3">
      <ContactActions />
      <ContactSearchForm searchParams={params} /> {/* 👈 Thêm ở đây */}
      <ContactTable searchParams={params} contacts={contacts} />
      <Flex gap="2">
        <PageSizeSelector searchParams={params} />
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={contactCount}
        />
      </Flex>
    </Flex>
  );
};

export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "Contact Tracker - Contact List",
//   description: "View all project Contacts",
// };

export default ContactsPage;
