import {
  AllInboxRounded,
  AttachMoney,
  BackupTable,
  DoneAll,
  LocalShippingRounded,
  ReceiptLong,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { OrderListTable } from "../../../components/orderListTable/OrderListTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest, userRequest } from "../../../requestMethods";
import { convertCurrency } from "../../../utils/formatStrings";
import "./shopOwnerDashboard.scss";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { OrderListTableAnt } from "../../../components/orderListTable/OrderListTableAnt";

const ShopOwnerDashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [profit, setProfit] = useState(0);
  const authUser = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const getStats = async () => {
    const profit = await userRequest.get(
      `/order/getTotalRevenue?ShopOwnerId=${authUser().id}`
    );
    setProfit(profit.data.data);
    const stats = await userRequest.get(
      `order/shopOwnerStatistic?shopOwnerId=${authUser().id}`
    );
    setStatistics(stats.data.data[0]);
  };
  useEffect(() => {
    getStats();
  }, []);

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
                <div className="bigNumber">{statistics.ShippingOrders}</div>
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
                <div className="bigNumber">{statistics.Delivering}</div>
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
                <div className="bigNumber">{statistics.Successful}</div>
              </div>
              <div className="right">
                <DoneAll
                  style={{ backgroundColor: "#14ae5c", borderColor: "#14ae5c" }}
                />
              </div>
            </div>
            <div className="shopOwnerOverviewTile">
              <div className="left">
                <span>Doanh thu</span>
                <div className="bigNumber">{convertCurrency(profit)}</div>
              </div>
              <div className="right">
                <AttachMoney
                  style={{ backgroundColor: "#14ae5c", borderColor: "#14ae5c" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="shopOwnerOrderListTableContainer">
          <div className="titleWrapper">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
            </h3>
            <Searchbar onInputChange={handleSearchQueryChange} placeholderText={"Mã vận đơn"} />
          </div>
          <OrderListTableAnt searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
