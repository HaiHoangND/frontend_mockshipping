import {
  AllInboxOutlined,
  AttachMoneyOutlined,
  Clear,
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
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest } from "../../../requestMethods";
import { useToastSuccess } from "../../../utils/toastSettings";
import "./orderDetail.scss";
import { OrderDetailPersonalInfo } from "../../../components/orderDetailPersonalInfo/OrderDetailPersonalInfo";
import { OrderDetailProductTable } from "../../../components/orderDetailProductTable/OrderDetailProductTable";
import { getArrayLastItem } from "../../../utils/getLastArrayItem";
import {
  convertCurrency,
  formatDateTimeDetail,
} from "../../../utils/formatStrings";
import { WarningModal } from "../../../components/warningModal/WarningModal";
import { useAuthUser } from "react-auth-kit";
import { UpdateOrderEmployeeModal } from "../../../components/updateOrderEmployeeModal/UpdateOrderEmployeeModal";

const OrderDetail = () => {
  const [order, setOrder] = useState();
  const orderCode = useLocation().pathname.split("/")[2];
  const navigate = useNavigate();
  console.log(order);
  const authUser = useAuthUser();
  const role = authUser().role;
  console.log(role);

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

  const handleCancelOrder = async (order) => {
    try {
      const res = await publicRequest.post("/orderStatus", {
        shippingOrderId: order.id,
        shipperId:
          order.orderStatusList.length === 0
            ? authUser().id
            : order.orderStatusList[0].shipper.id,
        orderRouteId: order.orderRoutes[0].id,
        status: "Đơn hủy",
        arriving: false,
      });

      if (res.data.type === "success") {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeOrderStatus = async (order) => {
    try {
      const res = await publicRequest.post("/orderStatus", {
        shippingOrderId: order.id,
        shipperId: order.orderStatusList[0].shipper.id,
        orderRouteId: getArrayLastItem(order.orderRoutes).id,
        status:
          order.orderStatusList[0].status === "Giao hàng thành công"
            ? "Quản lý đã nhận tiền"
            : "Đã đưa tiền cho chủ shop",
        arriving: false,
      });
      if (res.data.type === "success") {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateProductPrice = (products) => {
    let totalPrice = 0;
    for (const product of products) {
      totalPrice = totalPrice + product.price * product.quantity;
    }
    return totalPrice;
  };
  const chooseClassName = (status) => {
    switch (status.status) {
      case "Giao hàng thành công":
      case "Quản lý đã nhận tiền":
      case "Đã đưa tiền cho chủ shop":
        return "statusCircle";
      case "Đơn hủy":
        return "statusCircle canceled";
      default:
        return "statusCircle delivering";
    }
  };

  const CancelBtn = () => {
    return <button className="cancelOrderBtn">Hủy đơn hàng</button>;
  };
  const ChangeStatusBtn = () => {
    return (
      <button className="changeStatusOrderBtn">
        Chuyển trạng thái đơn hàng
      </button>
    );
  };
  const isDisabled = (type) => {
    if (order.orderStatusList.length === 0) {
      return false;
    } else if (order.orderStatusList[0].status === "Đơn hủy") {
      return true;
    } else if (
      (order.orderStatusList[0].status === "Đã đưa tiền cho chủ shop" ||
        order.orderStatusList[0].status === "Giao hàng thành công") &&
      (role === "COORDINATOR" || role === "ADMIN" || role === "SHOP")
    ) {
      return true;
    } else {
      return false;
    }
  };
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
                      "Đã đưa tiền cho chủ shop"
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
                    <Person /> <span>Nhân viên đảm nhận</span>
                  </div>
                  {order.orderStatusList.length !== 0 ? (
                    <>
                      <div className="shipperDetailItem">
                        <span>Mã số nhân viên:</span>
                        <span>
                          {getArrayLastItem(order.orderStatusList).shipper.id}
                        </span>
                      </div>
                      <div className="shipperDetailItem">
                        <span>Tên:</span>
                        <span>
                          {
                            getArrayLastItem(order.orderStatusList).shipper
                              .fullName
                          }
                        </span>
                      </div>
                      <div className="shipperDetailItem">
                        <span>Email:</span>
                        <span>
                          {
                            getArrayLastItem(order.orderStatusList).shipper
                              .email
                          }
                        </span>
                      </div>
                      <div className="shipperDetailItem">
                        <span>Số điện thoại:</span>
                        <span>
                          {
                            getArrayLastItem(order.orderStatusList).shipper
                              .phone
                          }
                        </span>
                      </div>
                      <div className="shipperDetailItem">
                        <span>Chức vụ:</span>
                        <span>
                          {order.orderStatusList.length === 0
                            ? authUser().role
                            : getArrayLastItem(order.orderStatusList).shipper
                                .role}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        minHeight: "20vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Chưa có nhân viên nào đảm nhận
                    </div>
                  )}
                  {!isDisabled() && <UpdateOrderEmployeeModal order={order} />}
                </div>

                <div className="orderDetailJourney">
                  <div className="orderDetailStatusItemsWrapper">
                    {order.orderStatusList.reverse().map((status) => (
                      <div className="orderDetailStatusItem" key={status.id}>
                        <div className="statusTime">
                          {formatDateTimeDetail(status.createdAt)}
                        </div>
                        <div className={chooseClassName(status)}>
                          {status.status === "Giao hàng thành công" ||
                          status.status === "Quản lý đã nhận tiền" ||
                          status.status === "Đã đưa tiền cho chủ shop" ? (
                            <DoneOutlined />
                          ) : status.status === "Đơn hủy" ? (
                            <Clear />
                          ) : (
                            <LocalShipping />
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
                    <div className="orderDetailStatusItem">
                      <div className="statusTime">
                        {formatDateTimeDetail(order.createdAt)}
                      </div>
                      <div
                        className="statusCircle"
                        style={{ backgroundColor: "gray", borderColor: "gray" }}
                      >
                        <ReceiptLongOutlined />
                      </div>
                      <div className="statusDetailWrapper">
                        <div className="statusDetailTitle">Tạo đơn</div>
                        <div className="statusDetailSub">
                          Tạo đơn thành công
                        </div>
                      </div>
                    </div>
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
                <span>
                  {convertCurrency(calculateProductPrice(order.products))}
                </span>
              </div>
              <hr className="createOrderHr" />
              <div className="orderDetailSummaryFeeContainer">
                <span>Tổng giá trị đơn hàng</span>
                <span>
                  {convertCurrency(
                    order.serviceFee + calculateProductPrice(order.products)
                  )}
                </span>
              </div>
              {!isDisabled("cancel") && (
                <WarningModal
                  InitiateComponent={CancelBtn}
                  warningContent={"Bạn có chắc muốn hủy đơn hàng này không?"}
                  confirmFunction={handleCancelOrder}
                  parameters={order}
                />
              )}
              {order.orderStatusList.length !== 0 &&
              (order.orderStatusList[0].status === "Quản lý đã nhận tiền" ||
                order.orderStatusList[0].status === "Giao hàng thành công") &&
              role === "ADMIN" ? (
                <WarningModal
                  InitiateComponent={ChangeStatusBtn}
                  warningContent={
                    "Bạn có chắc muốn chuyển trạng thái hàng này không?"
                  }
                  confirmFunction={handleChangeOrderStatus}
                  parameters={order}
                />
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
