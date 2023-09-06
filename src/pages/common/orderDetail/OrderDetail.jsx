import {
  AllInboxOutlined,
  AttachMoneyOutlined,
  DeliveryDiningOutlined,
  DoneOutlined,
  InfoOutlined,
  LocalShipping,
  LocalShippingOutlined,
  Person,
  ReceiptLongOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest } from "../../../requestMethods";
import { useToastSuccess } from "../../../utils/toastSettings";
import "./orderDetail.scss";
import { OrderDetailPersonalInfo } from "../../../components/orderDetailPersonalInfo/OrderDetailPersonalInfo";
import { OrderDetailProductTable } from "../../../components/orderDetailProductTable/OrderDetailProductTable";
import { getArrayLastItem } from "../../../utils/getLastArrayItem";
import { convertCurrency, formatDateTimeDetail } from "../../../utils/formatStrings";

const OrderDetail = () => {
  const [order, setOrder] = useState();
  const orderCode = useLocation().pathname.split("/")[2];
  console.log(order);
  const getOrderByCode = async () => {
    try {
      const res = await publicRequest.get(
        `/order/getByCode?orderCode=${orderCode}`
      );
      if (res.data.type === "success") {
        useToastSuccess("Lấy thông tin thành công!");
        setOrder(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderByCode();
  }, []);

  const handleCancelOrder = () => {
    
  }

  const calculateProductPrice = (products) => {
    let totalPrice = 0;
    for(const product of products){
      totalPrice = totalPrice + product.price * product.quantity;
    }
    return totalPrice
  }

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        {order && (
          <div>
            <div className="orderDetailStatus">
              <h3>
                <LocalShippingOutlined fontSize="inherit" /> Trạng thái đơn hàng
              </h3>
              <div className="orderDetailStatusBubblesWrapper">
                <div
                  className={
                    order.orderStatusList.length === 0
                      ? "statusBubble orderCreate"
                      : "statusBubble"
                  }
                >
                  <ReceiptLongOutlined />
                  <div>Tạo đơn</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng</div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Đang lấy hàng"
                      ? "statusBubble inProgress"
                      : "statusBubble"
                  }
                >
                  <DeliveryDiningOutlined />
                  <div>Đang lấy hàng</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng</div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Lấy hàng thành công"
                      ? "statusBubble inProgress"
                      : "statusBubble"
                  }
                >
                  <DeliveryDiningOutlined />
                  <div>Lấy hàng thành công</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng</div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Đang giao hàng"
                      ? "statusBubble inProgress"
                      : "statusBubble"
                  }
                >
                  <DeliveryDiningOutlined />
                  <div>Đang giao hàng</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng</div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Giao hàng thành công"
                      ? "statusBubble success"
                      : "statusBubble"
                  }
                >
                  <AllInboxOutlined />
                  <div>Giao hàng thành công</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng</div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Quản lý đã nhận tiền"
                      ? "statusBubble success"
                      : "statusBubble"
                  }
                >
                  <AttachMoneyOutlined />
                  <div>Quản lý đã nhận tiền</div>
                </div>
                <div className="lineWrapper">
                  <div className="line">
                    <div></div>
                  </div>
                  <div>Lấy hàng </div>
                </div>
                <div
                  className={
                    order.orderStatusList.length > 0 &&
                    getArrayLastItem(order.orderStatusList).status ===
                      "Quản lý đã nhận tiền"
                      ? "statusBubble success"
                      : "statusBubble"
                  }
                >
                  <AttachMoneyOutlined />
                  <div>Đã đưa tiền cho chủ shop</div>
                </div>
              </div>
            </div>
            <div className="orderDetailPersonalInfos">
              <h3>
                <InfoOutlined fontSize="inherit" />
                Thông tin khách hàng
              </h3>
              <div className="orderDetailPersonalInfosWrapper">
                <OrderDetailPersonalInfo
                  person={order.sender}
                  type={"Người gửi"}
                />
                <OrderDetailPersonalInfo
                  person={order.receiver}
                  type={"Người nhận"}
                />
              </div>
            </div>
            <div className="orderDetailProductTableWrapper">
              <h3>
                <ReceiptLongOutlined fontSize="inherit" /> Danh sách sản phẩm
              </h3>
              <OrderDetailProductTable products={order.products} />
            </div>
            <div className="orderDetailJourneyContainer">
              <h3>
                <LocalShippingOutlined fontSize="inherit" /> Hành trình đơn hàng
              </h3>
              <div className="orderDetailJourneyContent">
                <div className="orderDetailShipperDetail">
                  <div className="shipperDetailTitle">
                    <Person /> <span>Nhân viên giao vận</span>
                  </div>
                  <div className="shipperDetailItem">
                    <span>Mã số nhân viên:</span>
                    <span>
                      {getArrayLastItem(order.orderStatusList).shipper.id}
                    </span>
                  </div>
                  <div className="shipperDetailItem">
                    <span>Tên:</span>
                    <span>
                      {getArrayLastItem(order.orderStatusList).shipper.fullName}
                    </span>
                  </div>
                  <div className="shipperDetailItem">
                    <span>Email:</span>
                    <span>
                      {getArrayLastItem(order.orderStatusList).shipper.email}
                    </span>
                  </div>
                  <div className="shipperDetailItem">
                    <span>Số điện thoại:</span>
                    <span>
                      {getArrayLastItem(order.orderStatusList).shipper.phone}
                    </span>
                  </div>
                </div>
                <div className="orderDetailJourney">
                  <div className="orderDetailStatusItemsWrapper">
                    {order.orderStatusList.reverse().map((status) => (
                      <div className="orderDetailStatusItem" key={status.id}>
                        <div className="statusTime">
                          {formatDateTimeDetail(status.createdAt)}
                        </div>
                        <div
                          className={
                            status.status !== "Giao hàng thành công"
                              ? "statusCircle delivering"
                              : status.status !== "Quản lý đã nhận tiền"
                              ? "statusCircle delivering"
                              : status.status !== "Đã đưa tiền cho chủ shop"
                              ? "statusCircle delivering"
                              : "statusCircle"
                          }
                        >
                          {status.status !== "Giao hàng thành công" ? (
                            <LocalShipping />
                          ) : status.status !== "Quản lý đã nhận tiền" ? (
                            <LocalShipping />
                          ) : status.status !== "Đã đưa tiền cho chủ shop" ? (
                            <LocalShipping />
                          ) : (
                            <DoneOutlined />
                          )}
                        </div>
                        <div className="statusDetailWrapper">
                          <div className="statusDetailTitle">
                            {status.status}
                          </div>
                          <div className="statusDetailSub">
                            {status.arriving
                              ? `Đang đi đến ${status.orderRoute.address}`
                              : `Đã đến ${status.orderRoute.address}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="orderDetailSummaryContainer">
              <h3>
                <SummarizeOutlined fontSize="inherit" /> Tóm tắt đơn hàng
              </h3>
              <div className="orderDetailSummaryFeeContainer">
                <span>Phí dịch vụ</span>
                <span>{convertCurrency(order.serviceFee)}</span>
              </div>
              <div className="orderDetailSummaryFeeContainer">
                <span>Giá trị mặt hàng</span>
                <span>{convertCurrency(calculateProductPrice(order.products))}</span>
              </div>
              <hr className="createOrderHr" />
              <div className="orderDetailSummaryFeeContainer">
                <span>Tổng giá trị đơn hàng</span>
                <span>
                {convertCurrency(order.serviceFee + calculateProductPrice(order.products))}
                </span>
              </div>
              <div className="cancelOrderBtn">
                <button onClick={handleCancelOrder}>Hủy đơn hàng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
