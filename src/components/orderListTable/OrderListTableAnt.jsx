import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import {
  convertCurrency,
  convertDateTime,
  productsPrice,
} from "../../utils/formatStrings";
import { getArrayLastItem } from "../../utils/getLastArrayItem";

export const OrderListTableAnt = ({searchQuery}) => {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useAuthUser();
  const role = authUser().role;

  const getOrders = async (currentPage) => {
    let res;
    try {
      if (role === "ADMIN" || role === "COORDINATOR") {
        setIsLoading(true);
        res = await publicRequest.get(
          `/order?pageNumber=${currentPage}&pageSize=${5}&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
          setTotalCount(res.data.data.totalElements);
          setPage(currentPage);
          setIsLoading(false);
        } else return useToastError("Something went wrong!");
      } else if (role === "SHOP") {
        setIsLoading(true);
        res = await publicRequest.get(
          `/order/getByShopOwnerId?ShopOwnerId=${
            authUser().id
          }&pageNumber=${currentPage}&pageSize=${5}&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
          setTotalCount(res.data.data.totalElements);
          setPage(currentPage);
          setIsLoading(false);
        } else return useToastError("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders(1);
  }, [searchQuery]);

  const columns = [
    {
      title: "Mã vận đơn",
      dataIndex: "orderCode",
      key: "id",
      render: (orderCode) => (
        <Link to={`/orderDetail/${orderCode}`} target="_blank">
          {orderCode}
        </Link>
      ),
    },
    {
      title: "Người gửi",
      dataIndex: "shopOwner",
      key: "id",
      render: (shopOwner, row) => (
        <Link to={`/orderDetail/${row.orderCode}`} target="_blank">
          <span>{shopOwner.fullName}</span>
        </Link>
      ),
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "id",
      render: (receiver, row) => (
        <Link to={`/orderDetail/${row.orderCode}`} target="_blank">
          <span>{receiver.name}</span>
        </Link>
      ),
    },
    {
      title: "Nhân viên giao hàng",
      dataIndex: "orderStatusList",
      key: "id",
      render: (orderStatusList, row) => (
        <Link to={`/orderDetail/${row.orderCode}`} target="_blank">
          <span>
            {orderStatusList.length !== 0
              ? getArrayLastItem(orderStatusList)?.shipper.fullName
              : "Chưa phân công"}
          </span>
        </Link>
      ),
    },
    {
      title: "Giá trị mặt hàng",
      dataIndex: "products",
      key: "id",
      render: (products, row) => (
        <Link to={`/orderDetail/${row.orderCode}`} target="_blank">
          <span>{convertCurrency(productsPrice(products))}</span>
        </Link>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "id",
      render: (createdAt, row) => (
        <Link to={`/orderDetail/${row.orderCode}`} target="_blank">
          <span>{convertDateTime(createdAt)}</span>
        </Link>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatusList",
      key: "id",
      render: (orderStatusList) => {
        const lastStatus = getArrayLastItem(orderStatusList)?.status;
        let tagColor;

        switch (lastStatus) {
          case "Đơn hủy":
            tagColor = "volcano";
            break;
          case "Giao hàng thành công":
            tagColor = "green";
            break;
          case "Đã đưa tiền cho chủ shop":
            tagColor = "green";
            break;
          case "Đang giao hàng":
            tagColor = "yellow";
            break;
          case "Láy hàng thành công":
            tagColor = "yellow";
            break;
          case "Đang lấy hàng":
            tagColor = "yellow";
            break;
          default:
            tagColor = "geekblue"; // You can change this to another color for other statuses
            break;
        }

        return (
          <Tag color={tagColor}>
            {orderStatusList.length !== 0 ? lastStatus : "Tạo đơn"}
          </Tag>
        );
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={orders}
      loading={isLoading}
      rowKey={(record) => record.id}
      pagination={{
        pageSize: 5,
        current: page,
        total: totalCount,
        onChange: (page) => {
          getOrders(page);
        },
      }}
    />
  );
};
