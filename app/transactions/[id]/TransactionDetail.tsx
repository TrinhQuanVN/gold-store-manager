"use client";

import { TransactionHeaderWithRelation } from "@/types"; // hoặc nơi bạn export type
import { DataList, Flex, Table, Text } from "@radix-ui/themes";

interface Props {
  transaction: TransactionHeaderWithRelation;
}

export default function TransactionDetail({ transaction }: Props) {
  const {
    contact,
    isExport,
    note,
    paymentMethode,
    totalAmount,
    paymentAmounts,
  } = transaction;

  const goldDetails = transaction.goldTransactionDetails ?? [];
  const jewelryDetails = transaction.jewelryTransactionDetails ?? [];

  return (
    <Flex direction="column" gap="4">
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Loại giao dịch</DataList.Label>
          <DataList.Value>{isExport ? "Xuất" : "Nhập"}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Khách hàng</DataList.Label>
          <DataList.Value>
            {contact?.name} ({contact?.group?.name})
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Ghi chú</DataList.Label>
          <DataList.Value>{note || "Không có"}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Phương thức thanh toán</DataList.Label>
          <DataList.Value>{paymentMethode}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tổng tiền</DataList.Label>
          <DataList.Value>
            {totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Chi tiết thanh toán</DataList.Label>
          <DataList.Value>
            {paymentAmounts.map((p) => (
              <div key={p.id}>
                {p.type}:{" "}
                {p.amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            ))}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Text weight="bold" mb="2">
        Chi tiết vàng
      </Text>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Tên vàng</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Trọng lượng</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Giá</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Thành tiền</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {goldDetails.map((g) => (
            <Table.Row key={g.id}>
              <Table.Cell>{g.gold.name}</Table.Cell>
              <Table.Cell>{g.weight} chỉ</Table.Cell>
              <Table.Cell>{g.price.toLocaleString("vi-VN")}</Table.Cell>
              <Table.Cell>{g.amount.toLocaleString("vi-VN")}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Text weight="bold" mt="4" mb="2">
        Chi tiết trang sức
      </Text>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Tên trang sức</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Trọng lượng</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Giá</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Thành tiền</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {jewelryDetails.map((j) => (
            <Table.Row key={j.id}>
              <Table.Cell>
                {j.jewelry.name} {j.jewelry.category.name} /{" "}
                {j.jewelry.jewelryType.name}
              </Table.Cell>

              <Table.Cell>{j.jewelry.goldWeight} chỉ</Table.Cell>
              <Table.Cell>{j.price.toLocaleString("vi-VN")}</Table.Cell>
              <Table.Cell>{j.amount.toLocaleString("vi-VN")}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
