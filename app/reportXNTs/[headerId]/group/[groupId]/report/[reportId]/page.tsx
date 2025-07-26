import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReportXNTDetail from "./ReportXNTDetail";
import DeleteReportXNTButton from "./DeleteReportXNTButton";
import EditReportXNTButton from "./EditReportXNTButton";
import { convertToRawReportXNTForm } from "@/app/reportXNTs/_components/convertToRawReportXNTHeaderForm";
// import { getServerSession } from "next-auth";
// import authOptions from "@/app/auth/authOptions";
// import AssigneeSelect from "./AssigneeSelect";
// import { cache } from "react";

const ContactDetailPage = async ({
  params,
}: {
  params: { headerId: string; groupId: string; reportId: string };
}) => {
  //   const session = await getServerSession(authOptions);
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const groupId = parseInt(_params.groupId);

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) notFound();

  const report = await prisma.reportXNT.findUnique({
    where: { id: parseInt(_params.reportId) },
  });
  if (!report) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <ReportXNTDetail report={convertToRawReportXNTForm(report)} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditReportXNTButton
            headerId={headerId}
            groupId={groupId}
            reportId={_params.reportId}
          />
          <DeleteReportXNTButton
            headerId={headerId}
            groupId={groupId}
            reportId={_params.reportId}
          />
        </Flex>
      </Box>
    </Grid>
  );
};

export default ContactDetailPage;
