import { Contact, ContactGroup } from "@prisma/client";
import type { GroupBase, OptionsOrGroups } from "react-select";
import axios from "axios";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { RawContactDataForm } from "@/app/validationSchemas";

export type OptionType = {
  value: number;
  label: string;
  data: RawContactDataForm;
  searchValues: string[];
};

export const loadOptions = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
): Promise<{
  options: OptionType[];
  hasMore: boolean;
}> => {
  const offset = Array.isArray(prevOptions) ? prevOptions.length : 0;

  const response = await axios.get("/api/contacts/AsyncPaginateSearch", {
    params: {
      search,
      offset,
    },
  });

  const { contactWithGroups: contacts, hasMore } = response.data as {
    contactWithGroups: RawContactDataForm[];
    hasMore: boolean;
  };

  const options: OptionType[] = contacts.map((c) => ({
    value: parseInt(c.id!),
    label: `${c.name} - ${c.phone ?? ""} - ${c.cccd ?? ""} - ${
      c.address ?? ""
    }`,
    data: c,
    searchValues: [
      c.name,
      c.phone ?? "",
      c.cccd ?? "",
      toLowerCaseNonAccentVietnamese(c.name),
    ],
  }));

  return {
    options,
    hasMore,
  };
};
