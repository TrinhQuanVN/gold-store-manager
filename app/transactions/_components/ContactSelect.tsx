"use client";

import { Contact, ContactGroup } from "@prisma/client";
import { useState } from "react";
import Select from "react-select";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import ContactLabel from "./ContactLabel";

interface Props {
  contacts: (Contact & { group: ContactGroup })[];
  onChange: (contact: Contact & { group: ContactGroup }) => void;
  value?: (Contact & { group: ContactGroup }) | null;
}

const ContactSelect = ({ contacts, onChange, value }: Props) => {
  const options = contacts.map((c) => ({
    value: c.id,
    label: <ContactLabel contact={c} />,
    data: c,
    searchValues: [
      c.name,
      c.phone ?? "",
      c.cccd ?? "",
      toLowerCaseNonAccentVietnamese(c.name),
    ],
  }));

  const filterOption = (option: any, rawInput: string) => {
    const normalized = toLowerCaseNonAccentVietnamese(rawInput.toLowerCase());
    return option.data.searchValues.some((val: string) =>
      toLowerCaseNonAccentVietnamese(val.toLowerCase()).includes(normalized)
    );
  };

  const selected = value
    ? options.find((opt) => opt.data.id === value.id)
    : null;

  return (
    <Select
      placeholder="Tìm theo tên, số CCCD hoặc số điện thoại"
      options={options}
      filterOption={filterOption}
      value={selected}
      onChange={(option) => {
        onChange(option!.data);
      }}
    />
  );
};

export default ContactSelect;
