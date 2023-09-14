import { Table } from "antd";
import { convertCurrency } from "../../utils/formatStrings";
import "./orderDetailProductTable.scss";

export const OrderDetailProductTable = ({ products }) => {
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (text) => (
        <div style={{ maxWidth: "100px" }}>
          <img src={text} style={{ maxWidth: "100%", objectFit: "cover" }} />
        </div>
      ),
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      render: (text) => <span>{text} KG</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (text) => <span>{convertCurrency(text)}</span>,
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      render: (text) => <span>{text}</span>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey={(record) => record.id}
    />
  );
};
