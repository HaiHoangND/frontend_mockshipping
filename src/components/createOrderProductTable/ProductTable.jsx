import { ReceiptLong } from "@mui/icons-material";
import { Col, Row, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";

const { Option } = Select;
export const ProductTable = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [inStockProducts, setInStockProducts] = useState([]);

  const getInStockProducts = async () => {
    try {
      const res = await publicRequest.get(
        "/productShop/getByShopOwnerId?ShopOwnerId=1&pageNumber=1&pageSize=10"
      );
      setInStockProducts(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInStockProducts();
  }, []);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <div style={{ maxWidth: "100px" }}>
          <img style={{ width: "100%" }} src={image} />
        </div>
      ),
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
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
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
  ];

  const handleOrderProductChange = (values) => {
    const filteredProducts = [];
    for (const value of values) {
      const filteredProduct = inStockProducts.find(
        (product) => product.id === value
      );
      filteredProducts.push(filteredProduct);
    }
    setOrderProducts(filteredProducts);
  };
  console.log(orderProducts);
  return (
    <>
      <Select
        style={{ width: "100%", margin: "30px 0px" }}
        mode="multiple"
        placeholder="Chọn sản phẩm"
        onChange={handleOrderProductChange}
        filterOption={(inputValue, option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
      >
        {inStockProducts.map((product) => (
          <Option key={product.id} value={product.id} label={product.name}>
            <Space>{product.name}</Space>
          </Option>
        ))}
      </Select>

      <Table
        columns={columns}
        dataSource={orderProducts}
        rowKey={(record) => record.id}
      />
    </>
  );
};
