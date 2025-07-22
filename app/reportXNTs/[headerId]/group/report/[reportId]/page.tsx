import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReportXNTDetail from "./ReportXNTDetail";
import DeleteReportXNTButton from "./DeleteReportXNTButton";
import EditReportXNTButton from "./EditReportXNTButton";
// import { getServerSession } from "next-auth";
// import authOptions from "@/app/auth/authOptions";
// import AssigneeSelect from "./AssigneeSelect";
// import { cache } from "react";

const ContactDetailPage = async ({
  params,
}: {
  params: { headerId: string; reportId: string };
}) => {
  //   const session = await getServerSession(authOptions);
  const _params = await params;
  const headerId = parseInt(_params.headerId);

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();

  const report = await prisma.reportXNT.findUnique({
    where: { id: _params.reportId },
    include: {
      golds: true,
      jewelries: true,
    },
  });
  if (!report) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <ReportXNTDetail report={report} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditReportXNTButton
            headerId={headerId}
            reportId={_params.reportId}
          />
          <DeleteReportXNTButton
            headerId={headerId}
            reportId={_params.reportId}
          />
        </Flex>
      </Box>
    </Grid>
  );
};

export default ContactDetailPage;
