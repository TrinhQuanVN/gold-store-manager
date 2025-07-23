import { prisma } from "@/prisma/client";
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import DeleteReportXNTGroupButton from "./DeleteReportXNTGroupButton";
import EditReportXNTGroupButton from "./EditReportXNTGroupButton";
import ReportXNTGroupDetail from "./ReportXNTGroupDetail";
import ReportXNTTable from "./reportXNTTable";
import ReportActions from "./ReportActions";
import { convertToRawReportXNTForm } from "@/app/reportXNTs/_components/convertToRawReportXNTHeaderForm";
// import { getServerSession } from "next-auth";
// import authOptions from "@/app/auth/authOptions";
// import AssigneeSelect from "./AssigneeSelect";
// import { cache } from "react";

const ReportXNTGroupDetailPage = async ({
  params,
}: {
  params: { headerId: string; groupId: string };
}) => {
  //   const session = await getServerSession(authOptions);
  const _params = await params;
  const headerId = parseInt(_params.headerId);

  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) notFound();

  const groupId = parseInt(_params.groupId);

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: parseInt(_params.groupId) },
    include: {
      ReportXNTs: true,
    },
  });
  if (!group) notFound();

  return (
    <>
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="md:col-span-4">
          <ReportXNTGroupDetail
            group={{
              name: group.name,
              stt: group.stt.toString(),
            }}
          />
        </Box>
        <Box>
          <Flex direction="column" gap="4">
            <EditReportXNTGroupButton headerId={headerId} groupId={groupId} />
            <DeleteReportXNTGroupButton headerId={headerId} groupId={groupId} />
          </Flex>
        </Box>
      </Grid>

      <Box>
        <Heading size="4" mb="3">
          <Flex align="center" justify="between" mb="3">
            <Text weight="bold">Chi tiết nhóm sản phẩm thuộc báo cáo</Text>
            <ReportActions reportHeaderId={headerId} groupId={groupId} />
          </Flex>
        </Heading>
        <ReportXNTTable
          searchParams={{
            orderBy: "name",
            orderDirection: "asc",
            page: "1",
            pageSize: "50",
          }}
          headerId={headerId}
          reports={group.ReportXNTs.map(convertToRawReportXNTForm)}
        />
      </Box>
    </>
  );
};

export default ReportXNTGroupDetailPage;
