import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";
import { getArrayLastItem } from "../../../utils/getLastArrayItem";
import {
  convertCurrency,
  convertDateTime,
  productsPrice,
} from "../../../utils/formatStrings";

export const ProductsListTableAnt = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const authUser = useAuthUser();
  const role = authUser().role;
  const [searchQuery, setSearchQuery] = useState("");

  const getProducts = async () => {
    try {
      let res = await publicRequest.get(
        `/user/${authUser().id
        }`
      );
      if (res.data.type === "success") {
        console.log(res);
        setProducts(res.data.data.productShops);
      } else return useToastError("Something went wrong!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image) => (
        <div style={{ maxWidth: "100px", height: "130px" }}>
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
    {
      title: "Actions",
      dataIndex: "action",
      render: () => {
        return (
          <>
            <Button type="primary" color="geekblue" style={{ marginRight: '20px', marginLeft: '30px' }}>
              Chỉnh sửa
            </Button>
            <Button type="primary" danger>
              Xóa sản phẩm
            </Button>
          </>
        );
      },
    },
  ];
  return <Table columns={columns}
    rowKey={(record) => record.id}
    dataSource={products} />;
};
