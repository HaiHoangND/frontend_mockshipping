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

const DeliveryStatus = styled.div`
  padding: 10px 3px;
  border-radius: 15px;
  text-align: center;
  background-color: ${(props) =>
    props.name === "Đang giao hàng"
      ? "#ffcd29"
      : props.name === "Đang lấy hàng"
      ? "#ffcd29"
      : props.name === "Giao hàng thành công"
      ? "#14ae5c"
      : props.name === "Đã hủy"
      ? "#f24822"
      : "gray"};
`;

export const OrderListTable = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const getOrders = async () => {
    const res = await publicRequest.get(`/order?pageNumber=${page}&pageSize=5`);
    if (res.data.type === "success") {
      useToastSuccess(res.data.message);
      setOrders(res.data.data.content);
    } else return useToastError("Something went wrong!");
  };

  useEffect(() => {
    getOrders();
  }, [page]);

  const handleNextPagination = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPagination = () => {
    setPage((prev) => prev - 1);
  };

  console.log(orders);
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
                <td>{order.orderCode}</td>
              <td>{order.sender.name}</td>
              <td>{order.receiver.name}</td>
              <td>
                {order.orderStatusList.length === 0 ? "Chưa phân công" :getArrayLastItem(order.orderStatusList).shipper.fullName}
              </td>
              <td>{convertCurrency(productsPrice(order.products))}</td>
              <td>{convertDateTime(order.createdAt)}</td>
              <td>
                <DeliveryStatus
                  name={order.orderStatusList.length === 0 ? "Đã tạo đơn" :getArrayLastItem(order.orderStatusList).status}
                >
                  {order.orderStatusList.length === 0 ? "Đã tạo đơn" :getArrayLastItem(order.orderStatusList).status}
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
          //   disabled={orders?.length < 15}
          className="paginationButton"
          onClick={handleNextPagination}
        >
          <ArrowForwardIos />
        </button>
      </div>
    </div>
  );
};
