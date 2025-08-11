import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { Prisma } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import ContactActions from "./ContactActions";
import ContactTable, { columnNames } from "./ContactTable";
import { ContactSearchQuery } from "./ContactSearchQuery";
import dynamic from "next/dynamic";

interface Props {
  searchParams: ContactSearchQuery;
}
const ContactSearchForm = dynamic(() => import("./ContactSearchForm"), {
  // ssr: false,
  // loading: () => <ContactFormSkeleton />,
});

const ContactsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const orderDirection = params.orderDirection === "desc" ? "desc" : "asc";

  const page = parseInt(params.page) || 1;
  const pageSize = parseInt(params.pageSize) || 10;

  const where = {
    ...(params.id && {
      id: !isNaN(Number(params.id)) ? Number(params.id) : -1, // an ID that will never match
    }),
    ...(params.name && {
      OR: [
        { name: { contains: params.name } },
        {
          unaccentName: {
            contains: toLowerCaseNonAccentVietnamese(params.name),
          },
        },
      ],
    }),
    ...(params.cccd && {
      cccd: { contains: params.cccd },
    }),
    ...(params.phone && {
      phone: { contains: params.phone },
    }),
  };

  const contacts = await prisma.contactListView.findMany({
    where,
    orderBy: columnNames.includes(params.orderBy)
      ? [{ [params.orderBy]: orderDirection }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }],
    ...(pageSize !== undefined && {
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  });

  const contactCount = await prisma.contactListView.count({
    where,
  });

  return (
    <Flex direction="column" gap="3">
      <ContactSearchForm searchParams={params} />
      <ContactActions />
      <ContactTable searchParams={params} contacts={contacts} />
      <Flex gap="2">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={contactCount}
        />
      </Flex>
    </Flex>
  );
};

// export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "Contact Tracker - Contact List",
//   description: "View all project Contacts",
// };

export default ContactsPage;
