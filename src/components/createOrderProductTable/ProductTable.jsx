import { DeleteOutlined } from "@ant-design/icons";
import { Button, InputNumber, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import { removeItemByIndex } from "../../utils/getLastArrayItem";
import { useAuthUser } from "react-auth-kit";

const { Option } = Select;
export const ProductTable = ({
  onProductWeightChange,
  onProductPriceChange,
  onProductChange,
}) => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [inStockProducts, setInStockProducts] = useState([]);
  const authUser = useAuthUser();

  const getInStockProducts = async () => {
    try {
      const res = await publicRequest.get(
        `/productShop/getByShopOwnerId?ShopOwnerId=${authUser().id}&pageNumber=1&pageSize=10`
      );
      setInStockProducts(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let productWeight = 0;
    let productPrice = 0;
    for (const product of orderProducts) {
      if (product.weight && product.price) {
        productWeight = productWeight + product.weight * product.shipQuantity;
        productPrice = productPrice + product.price * product.shipQuantity;
      }
    }
    onProductWeightChange(productWeight);
    onProductPriceChange(productPrice);
  }, [orderProducts]);

  useEffect(() => {
    getInStockProducts();
  }, []);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <div style={{ maxWidth: "100px" }}>
          <img style={{ width: "100%", objectFit: "cover" }} src={image} />
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
      title: "Trong kho",
      dataIndex: "quantity",
    },
    {
      title: "Số lượng",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.quantity}
          value={record.shipQuantity} // Set the value from the product's shipQuantity
          onChange={
            (newValue) => onProductQuantityChange(record.id, newValue) // Update the product's shipQuantity
          }
        />
      ),
    },
    {
      title: "Xóa sản phẩm",
      align: "center",
      render: (text, record, index) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteProduct(index)}
        />
      ),
    },
  ];

  const handleDeleteProduct = (index) => {
    const newArr = removeItemByIndex(orderProducts, index);
    setOrderProducts(newArr);
    onProductChange(newArr);
  };

  const onProductQuantityChange = (productId, newQuantity) => {
    setOrderProducts((prevOrderProducts) => {
      return prevOrderProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, shipQuantity: newQuantity };
        }
        return product;
      });
    });
  };

  const handleOrderProductChange = (values) => {
    const filteredProducts = [];
    for (const value of values) {
      const filteredProduct = inStockProducts.find(
        (product) => product.id === value
      );
      const existingProduct = orderProducts.find(
        (product) => product.id === value
      );

      if (existingProduct) {
        filteredProducts.push(existingProduct); // Use the existing product if it exists
      } else {
        filteredProducts.push({ ...filteredProduct, shipQuantity: 0 }); // Otherwise, initialize shipQuantity to 0
      }
    }
    setOrderProducts(filteredProducts);
    onProductChange(filteredProducts);
  };
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
