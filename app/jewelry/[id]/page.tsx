import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditJewelryButton from "./EditJewelryButton";
import DeleteJewelryButton from "./DeleteJewelryButton";
import JewelryDetail from "./JewelryDetail";
import { convertJewelryRelationToNumber } from "@/prismaRepositories";
import { convertPrismaJewelryWithCateogryAndTypeToString } from "@/prismaRepositories/StringConverted";

interface Props {
  params: { id: string };
}

const JewelryDetailPage = async ({ params }: Props) => {
  const _params = await params;
  const jewelry = await prisma.jewelry.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      category: true,
      jewelryType: true,
    },
  });

  if (!jewelry) notFound();

  const convertJewelries =
    convertPrismaJewelryWithCateogryAndTypeToString(jewelry);

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <JewelryDetail jewelry={convertJewelries} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditJewelryButton jewelryId={jewelry.id} />
          <DeleteJewelryButton jewelryId={jewelry.id} />
        </Flex>
      </Box>
    </Grid>
  );
};

export default JewelryDetailPage;
