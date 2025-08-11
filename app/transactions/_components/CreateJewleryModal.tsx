"use client";

import { useEffect, useState } from "react";
import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import JewelryForm from "@/app/jewelry/_components/JewelryForm";
import {
  JewelryCategory,
  JewelryReportCodeSuggestionView,
  JewelryType,
} from "@prisma/client";
import { JewleryWithCategoryAndTypeDataForm } from "@/app/validationSchemas";
import { RiAddCircleLine } from "react-icons/ri";
import axios from "axios";

interface Props {
  onCreate: (jewelry: JewleryWithCategoryAndTypeDataForm) => void;
}

const CreateJewelryModal = ({ onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [categories, setCategories] = useState<JewelryCategory[]>([]);

  useEffect(() => {
    if (open) {
      Promise.all([
        axios.get<JewelryType[]>("/api/jewelry/types"),
        axios.get<JewelryCategory[]>("/api/jewelry/categories"),
      ]).then(([typesRes, categoriesRes]) => {
        setTypes(typesRes.data);
        setCategories(categoriesRes.data);
      });
    }
  }, [open]);

  const handleCreate = async (data: JewleryWithCategoryAndTypeDataForm) => {
    onCreate(data); // chỉ dùng trong react-hook-form cha
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>
          <RiAddCircleLine size="25" />
          <Text>Thêm</Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Tạo mới trang sức</Dialog.Title>

        <JewelryForm
          types={types}
          categories={categories}
          onMySubmit={handleCreate}
          embedded
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CreateJewelryModal;
