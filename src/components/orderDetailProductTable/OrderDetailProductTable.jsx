import { Table } from "antd";
import { convertCurrency } from "../../utils/formatStrings";
import "./orderDetailProductTable.scss";

export const OrderDetailProductTable = ({ products }) => {
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <div style={{ width: "100px" }}>
          <img
            src={text}
            alt=""
            style={{ maxWidth: "100%", objectFit: "cover" }}
          />
        </div>
      ),
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
      render: (text) => <span>{text} KG</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{convertCurrency(text)}</span>,
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text}</span>,
    },
  ];

  return <Table columns={columns} dataSource={products} />;
};
