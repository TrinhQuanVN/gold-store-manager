import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReportXNTHeaderDetail from "./ReportXNTHeaderDetail";
import EditReportXNTHeaderButton from "./EditReportXNTHeaderButton";
import DeleteReportXNTHeaderButton from "./DeleteReportXNTHeaderButton";
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

const ReportXNTDetailPage = async ({ params }: Props) => {
  //   const session = await getServerSession(authOptions);
  //   const Contact = await fetchUser(parseInt(params.id));
  const _params = await params;

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      taxPayer: true, // Include the ContactGroup relation
    },
  });
  if (!header) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <ReportXNTHeaderDetail header={header} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditReportXNTHeaderButton headerId={header.id} />
          <DeleteReportXNTHeaderButton headerId={header.id} />
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

export default ReportXNTDetailPage;
