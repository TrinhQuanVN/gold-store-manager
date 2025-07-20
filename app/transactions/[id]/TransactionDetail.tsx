"use client";

import { ContactGroupBadge } from "@/app/components";
import { ConvertedTransactionHeaderWithRelation } from "@/prismaRepositories/StringConverted";
import { DateToStringVN, toStringVN } from "@/utils";
import { DataList, Flex, Table, Text } from "@radix-ui/themes";

interface Props {
  transaction: ConvertedTransactionHeaderWithRelation & { totalAmount: number };
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
          <DataList.Label>Ngày giao dịch</DataList.Label>
          <DataList.Value>
            {DateToStringVN(transaction.createdAt)}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Loại giao dịch</DataList.Label>
          <DataList.Value>{isExport ? "Xuất" : "Nhập"}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Khách hàng</DataList.Label>
          <DataList.Value>
            {contact?.name}
            <ContactGroupBadge ContactGroup={contact?.group} />
          </DataList.Value>
        </DataList.Item>

        {note ?? (
          <DataList.Item>
            <DataList.Label>Ghi chú</DataList.Label>
            <DataList.Value>{note}</DataList.Value>
          </DataList.Item>
        )}

        <DataList.Item>
          <DataList.Label>Phương thức thanh toán</DataList.Label>
          <DataList.Value>{paymentMethode}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Tổng tiền</DataList.Label>
          <DataList.Value>
            {toStringVN(totalAmount)} (
            {paymentAmounts.map((p) => (
              <div key={p.id}>
                {p.type}: {toStringVN(p.amount)} |
              </div>
            ))}
            )
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
              <Table.Cell>{toStringVN(g.weight, 0, 4)} chỉ</Table.Cell>
              <Table.Cell>{toStringVN(g.price)}</Table.Cell>
              <Table.Cell>{toStringVN(g.amount)}</Table.Cell>
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

              <Table.Cell>
                {toStringVN(j.jewelry.goldWeight, 0, 4)} chỉ
              </Table.Cell>
              <Table.Cell>{toStringVN(j.price)}</Table.Cell>
              <Table.Cell>{toStringVN(j.amount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
