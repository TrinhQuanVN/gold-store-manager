"use client";

import { GroupBase } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

import {
  loadOptions as loadContactOptions,
  OptionType,
} from "./loadContactOptions";
import { useEffect, useState } from "react";
import axios from "axios";
import { RawContactDataForm } from "@/app/validationSchemas";

interface Props {
  onChange: (contactId: string) => void;
  onContactChange?: (contact: RawContactDataForm | null) => void;
  value?: string;
}

const ContactSelect = ({ onChange, value, onContactChange }: Props) => {
  const [selected, setSelected] = useState<OptionType | null>(null);
  // Chuyển giá trị được chọn từ contact -> OptionType
  useEffect(() => {
    if (value) {
      axios.get(`/api/contacts/${value}`).then((res) => {
        const c = res.data as RawContactDataForm;
        const option: OptionType = {
          value: parseInt(c.id!),
          label: `${c.name} - ${c.phone ?? ""} - ${c.cccd ?? ""} - ${
            c.address ?? ""
          }`,
          data: c,
          searchValues: [],
        };
        setSelected(option);
        onContactChange?.(c);
      });
    } else {
      setSelected(null);
      onContactChange?.(null);
    }
  }, [value]);

  return (
    <AsyncPaginate<OptionType, GroupBase<OptionType>, unknown>
      placeholder="Tìm theo tên, số CCCD hoặc số điện thoại"
      value={selected}
      loadOptions={loadContactOptions}
      onChange={(opt) => {
        setSelected(opt);
        onChange(opt?.value != null ? opt.value.toString() : "");
      }}
      debounceTimeout={300}
    />
  );
};

export default ContactSelect;
