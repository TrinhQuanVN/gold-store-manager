import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditContactButton from "./EditContactButton";
import ContactDetail from "./ContactDetail";
import DeleteContactButton from "./DeleteContactButton";
// import { getServerSession } from "next-auth";
// import authOptions from "@/app/auth/authOptions";
// import AssigneeSelect from "./AssigneeSelect";
// import { cache } from "react";

interface Props {
  params: { id: string };
}

// const fetchUser = cache((ContactId: number) =>
//   prisma.Contact.findUnique({ where: { id: ContactId } })
// );

const ContactDetailPage = async ({ params }: Props) => {
  //   const session = await getServerSession(authOptions);
  //   const Contact = await fetchUser(parseInt(params.id));
  const _params = await params;

  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      group: true, // Include the ContactGroup relation
    },
  });
  if (!contact) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <ContactDetail contact={contact} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditContactButton ContactId={contact.id} />
          <DeleteContactButton ContactId={contact.id} />
        </Flex>
      </Box>
    </Grid>
  );
};

// export async function generateMetadata({ params }: Props) {
//   const Contact = await fetchUser(parseInt(params.id));

//   return {
//     title: Contact?.title,
//     description: "Details of Contact " + Contact?.id,
//   };
// }

export default ContactDetailPage;
