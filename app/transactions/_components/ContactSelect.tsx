"use client";

import { Contact, ContactGroup } from "@prisma/client";
import { JSX } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase } from "react-select";

import {
  loadOptions as loadContactOptions,
  OptionType,
  contactWithGroups,
} from "./loadContactOptions";

import ContactLabel from "./ContactLabel";

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
      // components={{
      //   Option: (props) => (
      //     <div style={{ padding: "4px 8px" }}>
      //       <ContactLabel contact={props.data.data} />
      //     </div>
      //   ),
      //   SingleValue: (props) => (
      //     <div style={{ padding: "4px 8px" }}>
      //       <ContactLabel contact={props.data.data} />
      //     </div>
      //   ),
      // }}
    />
  );
};

export default ContactSelect;
