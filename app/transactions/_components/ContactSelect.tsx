"use client";

import { GroupBase } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

import {
  contactWithGroups,
  loadOptions as loadContactOptions,
  OptionType,
} from "./loadContactOptions";

interface Props {
  onChange: (contact: contactWithGroups) => void;
  value?: contactWithGroups | null;
}

const ContactSelect = ({ onChange, value }: Props) => {
  // Chuyển giá trị được chọn từ contact -> OptionType
  const selectedOption: OptionType | null = value
    ? {
        value: value.id,
        label: `${value.name} - ${value.phone ?? ""} - ${value.cccd ?? ""} - ${
          value.address ?? ""
        }`,
        data: value,
        searchValues: [],
      }
    : null;

  return (
    <AsyncPaginate<OptionType, GroupBase<OptionType>, unknown>
      placeholder="Tìm theo tên, số CCCD hoặc số điện thoại"
      value={selectedOption}
      loadOptions={loadContactOptions}
      onChange={(opt) => opt && onChange(opt.data)}
      debounceTimeout={300}
    />
  );
};

export default ContactSelect;
