import { useEffect, useState } from "react";
import "./orderListTable.scss";
import { publicRequest } from "../../requestMethods";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { getArrayLastItem } from "../../utils/getLastArrayItem";
import {
  convertCurrency,
  convertDateTime,
  productsPrice,
} from "../../utils/formatStrings";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

const DeliveryStatus = styled.div`
  padding: 10px 3px;
  border-radius: 15px;
  text-align: center;
  color: white;
  background-color: ${(props) =>
    props.name === "Đang giao hàng"
      ? "#ffcd29"
      : props.name === "Đang lấy hàng"
      ? "#ffcd29"
      : props.name === "Lấy hàng thành công"
      ? "#ffcd29"
      : props.name === "Giao hàng thành công"
      ? "#14ae5c"
      : props.name === "Đã đưa tiền cho chủ shop"
      ? "#14ae5c"
      : props.name === "Đơn hủy"
      ? "#f24822"
      : "gray"};
`;

export const OrderListTable = ({ searchQuery }) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useAuthUser();
  const role = authUser().role;

  const getOrders = async () => {
    let res;
    try {
      if (role === "ADMIN" || role === "COORDINATOR") {
        setIsLoading(true);
        res = await publicRequest.get(
          `/order?pageNumber=${page}&pageSize=10&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
          setIsLoading(false);
        } else return useToastError("Something went wrong!");
      } else if (role === "SHOP") {
        setIsLoading(true);
        res = await publicRequest.get(
          `/order/getByShopOwnerId?ShopOwnerId=${
            authUser().id
          }&pageNumber=${page}&pageSize=10&orderCode=${searchQuery}`
        );
        if (res.data.type === "success") {
          setOrders(res.data.data.content);
          setIsLoading(false);
        } else return useToastError("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrders();
  }, [page, searchQuery]);

  const handleNextPagination = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPagination = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Mã vận đơn</th>
            <th>Người gửi</th>
            <th>Người nhận</th>
            <th>Nhân viên giao hàng</th>
            <th>Giá trị mặt hàng</th>
            <th>Ngày tạo</th>
            <th style={{ textAlign: "center" }}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {order.orderCode}
                </Link>
              </td>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {order.shopOwner.fullName}
                </Link>
              </td>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {order.receiver.name}
                </Link>
              </td>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {order.orderStatusList.length === 0
                    ? "Chưa phân công"
                    : getArrayLastItem(order.orderStatusList).shipper.fullName}
                </Link>
              </td>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {convertCurrency(productsPrice(order.products))}
                </Link>
              </td>
              <td>
                <Link to={`/orderDetail/${order.orderCode}`} target="_blank">
                  {convertDateTime(order.createdAt)}
                </Link>
              </td>
              <td>
                <DeliveryStatus
                  name={
                    order.orderStatusList.length === 0
                      ? "Đã tạo đơn"
                      : getArrayLastItem(order.orderStatusList).status
                  }
                >
                  {order.orderStatusList.length === 0
                    ? "Đã tạo đơn"
                    : getArrayLastItem(order.orderStatusList).status}
                </DeliveryStatus>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={page === 1}
          className="paginationButton"
          onClick={handlePrevPagination}
        >
          <ArrowBackIosNew />
        </button>
        <div className="w-9 text-center">{page}</div>
        <button
          disabled={orders?.length < 10}
          className="paginationButton"
          onClick={handleNextPagination}
        >
          <ArrowForwardIos />
        </button>
      </div>
    </div>
  );
};
