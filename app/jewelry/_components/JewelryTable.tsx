"use client";

import { Table } from "@radix-ui/themes";
import { JewleryWithCategoryAndTypeDataForm } from "@/app/validationSchemas/jewelrySchemas";
import { toStringVN } from "@/utils";

type Props = {
  data: JewleryWithCategoryAndTypeDataForm[];
  onSelect: (item: JewleryWithCategoryAndTypeDataForm) => void;
};

const JewelryTable: React.FC<Props> = ({ data, onSelect }) => {
  return (
    <Table.Root variant="surface" className="mt-3 rounded-2xl shadow">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Tên</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Mã XNT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Loại vàng</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Loại trang sức</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TL vàng</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((j) => (
          <Table.Row
            key={`${j.reportProductCode}-${j.id}`}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(j)}
          >
            <Table.Cell>{j.name}</Table.Cell>
            <Table.Cell>{j.reportProductCode}</Table.Cell>
            <Table.Cell>{j.type?.name}</Table.Cell>
            <Table.Cell>{j.category?.name}</Table.Cell>
            <Table.Cell>{toStringVN(+j.goldWeight, 0, 4)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default JewelryTable;
