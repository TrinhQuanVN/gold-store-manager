"use client";

import { Button, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ContactSearchQuery } from "./ContactSearchQuery";

const ContactSearchForm = ({
  searchParams,
}: {
  searchParams: ContactSearchQuery;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [cccd, setCccd] = useState("");
  const [phone, setPhone] = useState("");

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && !["name", "cccd", "phone"].includes(key)) {
        params.set(key, val);
      }
    });

    const action = formData.get("action");
    const value = formData
      .get(action as string)
      ?.toString()
      .trim();

    if (value) {
      params.set(action as string, value); // ✅ thay vì field/value
    } else {
      params.delete("name");
      params.delete("cccd");
      params.delete("phone");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push("?" + params.toString());
    });
  };

  return (
    <form action={handleSearch}>
      <Flex gap="3" align="end" wrap="wrap">
        <TextField.Root
          name="name"
          placeholder="Tên khách hàng"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" name="action" value="name" disabled={isPending}>
          Tìm theo tên
        </Button>

        <TextField.Root
          name="cccd"
          placeholder="Căn cước"
          value={cccd}
          onChange={(e) => setCccd(e.target.value)}
        />
        <Button type="submit" name="action" value="cccd" disabled={isPending}>
          Tìm theo CCCD
        </Button>

        <TextField.Root
          name="phone"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button type="submit" name="action" value="phone" disabled={isPending}>
          Tìm theo SĐT
        </Button>
      </Flex>
    </form>
  );
};

export default ContactSearchForm;
