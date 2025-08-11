import { Skeleton } from "@/app/components";
import { Table } from "@radix-ui/themes";
import TransactionActions from "./TransactionActions";

const LoadingContactPage = () => {
  const contacts = [1, 2, 3, 4, 5];

  return (
    <div>
      {/* <TransactionActions /> */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Tên</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="">
              Căn cước
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="">
              Địa chỉ
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="">
              Điện thoại
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Ngày tạo
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contacts.map((contact) => (
            <Table.Row key={contact}>
              <Table.Cell>
                <Skeleton />
                <div className="block md:hidden">
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default LoadingContactPage;
