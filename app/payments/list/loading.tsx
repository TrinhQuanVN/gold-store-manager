"use client";

import { Table, Flex } from "@radix-ui/themes";
import clsx from "clsx";

const PaymentsSkeleton = () => {
  const skeletonRowCount = 8;

  return (
    <Flex direction="column" gap="3">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell rowSpan={2}>Ngày</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={2}>Xuất</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell colSpan={2}>Nhập</Table.ColumnHeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeaderCell>Tiền mặt</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Chuyển khoản</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tiền mặt</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Chuyển khoản</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: skeletonRowCount }).map((_, i) => (
            <Table.Row key={i}>
              {Array.from({ length: 5 }).map((_, j) => (
                <Table.Cell key={j}>
                  <div
                    className={clsx(
                      "h-4 w-full animate-pulse rounded bg-gray-200"
                    )}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div className="mt-4 flex justify-center">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </Flex>
  );
};

export default PaymentsSkeleton;
