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
  searchParams: { redirectTo?: string };
}

const EditContactPage = async ({ params, searchParams }: Props) => {
  const _params = await params;
  const _searchParams = await searchParams;
  const redirectTo = _searchParams.redirectTo ?? "";
  const contactgroups = await prisma.contactGroup.findMany();
  if (!contactgroups || contactgroups.length === 0) {
    notFound();
  }

  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
    include: {
      group: true, // Include the ContactGroup relation
    },
  });
  if (!contact) notFound();

  return (
    <ContactForm
      contact={contact}
      groups={contactgroups}
      redirectTo={redirectTo}
    />
  );
};

export default EditContactPage;
