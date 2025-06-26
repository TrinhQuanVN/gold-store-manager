import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import JewelryFormSkeleton from "../../_components/JewelryFormSkeleton";

const JewelryForm = dynamic(() => import("../../_components/JewelryForm"), {
  loading: () => <JewelryFormSkeleton />,
});

interface Props {
  params: { id: string };
}

const EditJewelryPage = async ({ params }: Props) => {
  const _params = await params;

  const types = await prisma.jewelryType.findMany();
  const categories = await prisma.jewelryCategory.findMany();

  const jewelry = await prisma.jewelry.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      category: true,
      jewelryType: true,
    },
  });

  if (!jewelry) notFound();

  return (
    <JewelryForm jewelry={jewelry} types={types} categories={categories} />
  );
};

export default EditJewelryPage;
