import { ReceiptLong } from "@mui/icons-material";
import { Col, Row, Select, Space, Table } from "antd";
import React from "react";

const { Option } = Select;
export const ProductTable = ({ products }) => {
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
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
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
    },
  ];
  return (
    <>
      <Select
        style={{ width: "100%", margin: "30px 0px" }}
        mode="multiple"
        placeholder="Chọn sản phẩm"
      ></Select>

      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record.id}
      />
    </>
  );
};
