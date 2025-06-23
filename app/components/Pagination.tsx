// "use client";

// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   DoubleArrowLeftIcon,
//   DoubleArrowRightIcon,
// } from "@radix-ui/react-icons";
// import { Button, Flex, Text } from "@radix-ui/themes";
// import { useRouter, useSearchParams } from "next/navigation";
// import React from "react";

// interface Props {
//   itemCount: number;
//   pageSize: number;
//   currentPage: number;
// }

// const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const pageCount = Math.ceil(itemCount / pageSize);
//   if (pageCount <= 1) return null;

//   const changePage = (page: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", page.toString());
//     router.push("?" + params.toString());
//   };

//   return (
//     <Flex align="center" gap="2">
//       <Text size="2">
//         Page {currentPage} of {pageCount}
//       </Text>
//       <Button
//         color="gray"
//         variant="soft"
//         disabled={currentPage === 1}
//         onClick={() => changePage(1)}
//       >
//         <DoubleArrowLeftIcon />
//       </Button>
//       <Button
//         color="gray"
//         variant="soft"
//         disabled={currentPage === 1}
//         onClick={() => changePage(currentPage - 1)}
//       >
//         <ChevronLeftIcon />
//       </Button>
//       <Button
//         color="gray"
//         variant="soft"
//         disabled={currentPage === pageCount}
//         onClick={() => changePage(currentPage + 1)}
//       >
//         <ChevronRightIcon />
//       </Button>
//       <Button
//         color="gray"
//         variant="soft"
//         disabled={currentPage === pageCount}
//         onClick={() => changePage(pageCount)}
//       >
//         <DoubleArrowRightIcon />
//       </Button>
//     </Flex>
//   );
// };

// export default Pagination;

"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Text, Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const pageCount = Math.ceil(itemCount / pageSize);
  const currentSize = searchParams.get("pageSize") || "10";
  const pageSizes = ["10", "20", "50", "100"];

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push("?" + params.toString());
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    params.set("page", "1"); // Reset to first page
    startTransition(() => {
      router.push("?" + params.toString());
    });
  };

  if (pageCount <= 1 && currentSize === pageSizes[0]) return null;

  return (
    <Flex align="center" gap="4" wrap="wrap" justify="between" mt="4">
      {/* Page size selector */}
      <Flex align="center" gap="2">
        <Text size="2">Số dòng trên trang:</Text>
        <Select.Root
          defaultValue={currentSize}
          onValueChange={handlePageSizeChange}
        >
          <Select.Trigger />
          <Select.Content>
            {pageSizes.map((size) => (
              <Select.Item key={size} value={size}>
                {size} / trang
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Pagination buttons */}
      <Flex align="center" gap="2">
        <Text size="2">
          Page {currentPage} of {pageCount}
        </Text>
        <Button
          color="gray"
          variant="soft"
          disabled={currentPage === 1}
          onClick={() => changePage(1)}
        >
          <DoubleArrowLeftIcon />
        </Button>
        <Button
          color="gray"
          variant="soft"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          color="gray"
          variant="soft"
          disabled={currentPage === pageCount}
          onClick={() => changePage(currentPage + 1)}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          color="gray"
          variant="soft"
          disabled={currentPage === pageCount}
          onClick={() => changePage(pageCount)}
        >
          <DoubleArrowRightIcon />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Pagination;
