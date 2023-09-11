import {
  AllInboxRounded,
  BackupTable,
  Done,
  DoneAll,
  LocalShippingRounded,
  ReceiptLong,
} from "@mui/icons-material";
import React from "react";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./shopOwnerDashboard.scss";
import { OrderListTable } from "../../../components/orderListTable/OrderListTable";

const ShopOwnerDashboard = () => {
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="shopOwnerDashboardOverviewContainer">
          <h3>
            <BackupTable fontSize="inherit" /> Tổng quan
          </h3>
          <div className="shopOwnerOverviewTilesContainer">
            <div className="shopOwnerOverviewTile">
              <div className="left">
                <span>Tổng đơn hàng</span>
                <div className="bigNumber">12</div>
              </div>
              <div className="right">
                <AllInboxRounded
                  style={{ backgroundColor: "#0d99ff", borderColor: "#0d99ff" }}
                />
              </div>
            </div>
            <div className="shopOwnerOverviewTile">
              <div className="left">
                <span>Đang vận chuyển</span>
                <div className="bigNumber">12</div>
              </div>
              <div className="right">
                <LocalShippingRounded
                  style={{ backgroundColor: "#ffcd29", borderColor: "#ffcd29" }}
                />
              </div>
            </div>
            <div className="shopOwnerOverviewTile">
              <div className="left">
                <span>Đơn hàng thành công</span>
                <div className="bigNumber">12</div>
              </div>
              <div className="right">
                <DoneAll
                  style={{ backgroundColor: "#14ae5c", borderColor: "#14ae5c" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="shopOwnerOrderListTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
          </h3>
          <OrderListTable />
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
