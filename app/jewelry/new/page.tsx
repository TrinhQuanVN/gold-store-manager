import dynamic from "next/dynamic";
import JewelryFormSkeleton from "../_components/JewelryFormSkeleton";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import {
  convertJewelryCategoryToNumber,
  convertJewelryTypeToNumber,
} from "@/prismaRepositories";

// Dynamic import với fallback loading Skeleton
const JewelryForm = dynamic(() => import("../_components/JewelryForm"), {
  loading: () => <JewelryFormSkeleton />,
});

const NewJewelryPage = async () => {
  // Lấy danh sách loại vàng và loại trang sức từ DB
  const [types, categories] = await Promise.all([
    prisma.jewelryType.findMany(),
    prisma.jewelryCategory.findMany(),
  ]);

  // Nếu không có dữ liệu nào thì trả về notFound
  if (!types.length || !categories.length) notFound();

  return <JewelryForm types={types} categories={categories} />;
};

export default NewJewelryPage;
