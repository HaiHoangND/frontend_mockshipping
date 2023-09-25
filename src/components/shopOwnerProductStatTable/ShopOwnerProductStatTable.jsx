import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { useAuthUser } from "react-auth-kit";

export const ShopOwnerProductStatTable = ({ type }) => {
  const [productStats, setProductStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const pageSize = 10;
  const authUser = useAuthUser();
  const getProductStats = async (currentPage) => {
    try {
      if (type === "soldOut") {
        setIsLoading(true);
        const res = await userRequest.get(
          `/productShop/getRunningOutProductShop?ShopOwnerId=${
            authUser().id
          }&pageNumber=${currentPage}&pageSize=${pageSize}`
        );
        setPage(currentPage);
        setTotalCount(res.data.data.totalElements);
        setProductStats(res.data.data.content);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        const res = await userRequest.get(
          `/productShop/getBestSelling?ShopOwnerId=${authUser().id}&numberOfProducts=${7}`
        );
        setProductStats(res.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductStats(1);
  }, []);

  const columns = [
    {
      title: "Tên",
      dataIndex: type === "soldOut" ? "name" : "productShop",
      render: (text) => (type === "soldOut" ? text : text.name),
      width: 170,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: type === "soldOut" ? "productCode" : "productShop",
      align: "center",
      render: (text) => (type === "soldOut" ? text : text.productCode),
    },
    {
      title: type === "soldOut" ? "Số lượng" : "Đã bán",
      dataIndex: type === "soldOut" ? "quantity" : "sumSoldProduct",
      align: "center",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={productStats}
      rowKey={(record) =>
        type === "soldOut" ? record.id : record.productShop.id
      }
      loading={isLoading}
      pagination={
        type === "soldOut"
          ? {
              pageSize: pageSize,
              current: page,
              total: totalCount,
              onChange: (page) => {
                getProductStats(page);
              },
            }
          : false
      }
    />
  );
};
