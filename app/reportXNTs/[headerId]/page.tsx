import { prisma } from "@/prisma/client";
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReportXNTHeaderDetail from "./ReportXNTHeaderDetail";
import EditReportXNTHeaderButton from "./EditReportXNTHeaderButton";
import DeleteReportXNTHeaderButton from "./DeleteReportXNTHeaderButton";
import ReportXNTTable from "./reportXNTTable";
import ReportActions from "./ReportActions";
// import { getServerSession } from "next-auth";
// import authOptions from "@/app/auth/authOptions";
// import AssigneeSelect from "./AssigneeSelect";
// import { cache } from "react";

interface Props {
  params: { headerId: string };
}

const ReportXNTDetailPage = async ({ params }: Props) => {
  //   const session = await getServerSession(authOptions);
  const _params = await params;

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
    include: {
      taxPayer: true,
      reportXNTs: true, // Include the ContactGroup relation
    },
  });
  if (!header) notFound();

  return (
    <>
      {/* Grid chứa chi tiết và nút */}
      <Grid columns={{ initial: "1", sm: "5" }} gap="5" className="mb-6">
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

      {/* Bảng nằm dưới tất cả */}
      <Box>
        <Heading size="4" mb="3">
          <Flex align="center" justify="between" mb="3">
            <Text weight="bold">Chi tiết báo cáo</Text>
            <ReportActions reportHeaderId={parseInt(_params.headerId)} />
          </Flex>
        </Heading>
        <ReportXNTTable
          searchParams={{
            orderBy: "name",
            orderDirection: "asc",
            page: "1",
            pageSize: "50",
          }}
          reports={header.reportXNTs}
        />
      </Box>
    </>
  );
};

export default ReportXNTDetailPage;
