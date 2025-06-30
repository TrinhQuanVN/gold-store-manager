import dynamic from "next/dynamic";
import ContactFormSkeleton from "../_components/ContactFormSkeleton";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/client";

const ContactForm = dynamic(() => import("../_components/ContactForm"), {
  //   ssr: false,
  loading: () => <ContactFormSkeleton />,
});

const NewContactPage = async () => {
  const contactgroups = await prisma.contactGroup.findMany();

  if (!contactgroups || contactgroups.length === 0) {
    notFound();
  }
  return <ContactForm groups={contactgroups} />;
};

export default NewContactPage;
