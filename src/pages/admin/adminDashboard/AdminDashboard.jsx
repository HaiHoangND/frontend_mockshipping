import {
  AttachMoney,
  CheckCircle,
  DeliveryDining,
  ReceiptLong,
  TrendingUp,
} from "@mui/icons-material";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./adminDashboard.scss";
import { OrderListTable } from "../../../components/orderListTable/OrderListTable";
import { ProfitChart } from "../../../components/profitChart/ProfitChart";
import { useEffect, useState } from "react";
import { publicRequest } from "../../../requestMethods";
import { convertCurrency } from "../../../utils/formatStrings";
import { Searchbar } from "../../../components/searchbar/Searchbar";

const AdminDashboard = () => {
  const [successfulOrders, setSuccessfulOrders] = useState(0);
  const [deliveringOrders, setDeliveringOrders] = useState(0);
  const [profit, setProfit] = useState(0);
  const currentDate = new Date();
  const currentDay = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad it with leading zeros if needed
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (Note: Month is zero-based, so we add 1) and pad it
  const currentYear = currentDate.getFullYear();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const getStats = async () => {
    try {
      const getSuccess = await publicRequest.get(
        "/order/countSuccessfulShippingOrders"
      );
      setSuccessfulOrders(getSuccess.data.data);
      const getDelivering = await publicRequest.get(
        "/order/countShippingOrdersDelivering"
      );
      setDeliveringOrders(getDelivering.data.data);
      const getProfit = await publicRequest.get(
        `/order/getTotalRevenueForDay?day=${currentDay}&month=${currentMonth}&year=${currentYear}`
      );
      if (!getProfit.data.data) {
        setProfit(0);
      } else {
        setProfit(getProfit.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="adminOverviewContainer">
          <div className="adminOverviewTilesContainer">
            <div className="adminOverviewSumSale">
              <h3>
                <TrendingUp fontSize="inherit" /> Doanh thu
              </h3>
              <div className="adminOverviewWrap">
                <div className="profitChartWrapper">
                  <ProfitChart />
                </div>
                <div className="adminOverviewStatistic">
                  <div className="adminStatisticOrders">
                    <div className="adminStatisticOrder">
                      <div className="left">
                        <span>Đơn đang giao</span>
                        <div className="bigNumber">{deliveringOrders}</div>
                      </div>
                      <div className="right">
                        <DeliveryDining
                          style={{
                            backgroundColor: "#0d99ff",
                            borderColor: "#0d99ff",
                          }}
                        />
                      </div>
                    </div>
                    <div className="adminStatisticOrder">
                      <div className="left">
                        <span>Đơn thành công</span>
                        <div className="bigNumber">{successfulOrders}</div>
                      </div>
                      <div className="right">
                        <CheckCircle
                          style={{
                            backgroundColor: "#14ae5c",
                            borderColor: "#14ae5c",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="adminStatisticSale">
                    <div className="left">
                      <span>Doanh thu trong ngày</span>
                      <div className="bigNumber">{convertCurrency(profit)}</div>
                    </div>
                    <div className="right">
                      <AttachMoney
                        style={{
                          backgroundColor: "#ffcd29",
                          borderColor: "#ffcd29",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="adminListTableContainer">
            <div className="titleWrapper">
              <h3>
                <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
              </h3>
              <Searchbar onInputChange={handleSearchQueryChange} placeholderText={"Mã vận đơn"}/>
            </div>
            <OrderListTable searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
