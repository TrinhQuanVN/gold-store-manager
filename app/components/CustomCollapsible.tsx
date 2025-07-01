"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { Flex, Text } from "@radix-ui/themes";

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CustomCollapsible = ({ title, children, defaultOpen = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-4">
      <Collapsible.Trigger asChild>
        <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer">
          <Flex align="center" gap="2">
            <div className="w-1 h-5 bg-gray-500 rounded-sm" />
            <Text className="font-medium text-gray-800">{title}</Text>
          </Flex>
          {open ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content className="mt-3">{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CustomCollapsible;
