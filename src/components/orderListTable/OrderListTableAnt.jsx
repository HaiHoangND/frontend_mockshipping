import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { publicRequest } from "../../requestMethods";
import { getArrayLastItem } from "../../utils/getLastArrayItem";
import {
  convertCurrency,
  convertDateTime,
  productsPrice,
} from "../../utils/formatStrings";

export const OrderListTableAnt = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const authUser = useAuthUser();
  const role = authUser().role;
  const [searchQuery, setSearchQuery] = useState("");

  const getOrders = async () => {
    let res;
    try {
      if (role === "ADMIN" || role === "COORDINATOR") {
        res = await publicRequest.get(
          `/order?pageNumber=${page}&pageSize=10&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
        } else return useToastError("Something went wrong!");
      } else if (role === "SHOP") {
        res = await publicRequest.get(
          `/order/getByShopOwnerId?ShopOwnerId=${
            authUser().id
          }&pageNumber=${page}&pageSize=10&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
        } else return useToastError("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [page, searchQuery]);

  const columns = [
    {
      title: "Mã vận đơn",
      dataIndex: "orderCode",
      key: "id",
      render: (orderCode) => (
        <Link to={`/orderDetail/${orderCode}`} target="_blank">{orderCode}</Link>
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
      render: (createdAt,row) => (
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
  return <Table columns={columns} dataSource={orders} />;
};
