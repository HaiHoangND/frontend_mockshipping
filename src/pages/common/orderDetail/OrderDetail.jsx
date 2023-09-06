import {
  AllInboxOutlined,
  AttachMoneyOutlined,
  DeliveryDiningOutlined,
  InfoOutlined,
  LocalShippingOutlined,
  ReceiptLongOutlined,
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
                    order.orderStatusList[orderStatusList.length - 1] ===
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
                    order.orderStatusList[orderStatusList.length - 1] ===
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
                    order.orderStatusList[orderStatusList.length - 1] ===
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
                    order.orderStatusList[orderStatusList.length - 1] ===
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
                    order.orderStatusList[orderStatusList.length - 1] ===
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
                    order.orderStatusList[orderStatusList.length - 1] ===
                      "Quản lý đã nhận tiền"
                      ? "statusBubble success"
                      : "statusBubble"
                  }
                >
                  <AttachMoneyOutlined />
                  <div>Quản lý đã nhận tiền</div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
