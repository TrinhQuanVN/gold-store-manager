import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import JewelryFormSkeleton from "../../_components/JewelryFormSkeleton";
import { convertJewleryWithCategoryAndTypeToRaw } from "@/app/validationSchemas";

const JewelryForm = dynamic(() => import("../../_components/JewelryForm"), {
  loading: () => <JewelryFormSkeleton />,
});

interface Props {
  params: { id: string };
  searchParams: { redirectTo?: string };
}

const EditJewelryPage = async ({ params, searchParams }: Props) => {
  const _params = await params;
  const _searchParams = await searchParams;

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
    <JewelryForm
      jewelry={convertJewleryWithCategoryAndTypeToRaw(jewelry)}
      types={types}
      categories={categories}
      redirectTo={_searchParams.redirectTo}
    />
  );
};

export default EditJewelryPage;
