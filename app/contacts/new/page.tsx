import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import ContactFormSkeleton from "../_components/ContactFormSkeleton";

const ContactForm = dynamic(() => import("../_components/ContactForm"), {
  //   ssr: false,
  loading: () => <ContactFormSkeleton />,
});

interface Props {
  searchParams: { redirectTo?: string };
}

const NewContactPage = async ({ searchParams }: Props) => {
  const _searchParams = await searchParams;
  const redirectTo = _searchParams.redirectTo ?? "";
  const contactgroups = await prisma.contactGroup.findMany();

  if (!contactgroups || contactgroups.length === 0) {
    notFound();
  }
  return <ContactForm groups={contactgroups} redirectTo={redirectTo} />;
};

export default NewContactPage;
