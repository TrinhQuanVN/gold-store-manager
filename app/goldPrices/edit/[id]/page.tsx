import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ContactFormSkeleton from "../../_components/ContactFormSkeleton";
// import ContactForm from "../../_components/ContactForm";

const ContactForm = dynamic(() => import("../../_components/ContactForm"), {
  //   ssr: false,
  loading: () => <ContactFormSkeleton />,
});

interface Props {
  params: { id: string };
}

const EditContactPage = async ({ params }: Props) => {
  const _params = await params;
  const contactgroups = await prisma.contactGroup.findMany();
  if (!contactgroups || contactgroups.length === 0) {
    notFound();
  }
  const groups: { id: number; name: string }[] = contactgroups.map((group) => ({
    id: group.id,
    name: group.name,
  }));
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      group: true, // Include the ContactGroup relation
    },
  });

  if (!contact) notFound();

  return <ContactForm contact={contact} groups={groups} />;
};

export default EditContactPage;
