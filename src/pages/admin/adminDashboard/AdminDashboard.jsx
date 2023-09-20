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
import { OrderListTableAnt } from "../../../components/orderListTable/OrderListTableAnt";
import { ProfitChart } from "../../../components/profitChart/ProfitChart";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../../../requestMethods";
import { convertCurrency } from "../../../utils/formatStrings";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { DatePicker } from "antd";
import dayjs from "dayjs";

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

  const [date, setDate] = useState({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  });

  const handleDateChange = (date) => {
    console.log(date);
    setDate({
      day: date.$D,
      month: date.$M + 1,
      year: date.$y,
    });
  };

  const getStats = async () => {
    try {
      const getSuccess = await userRequest.get(
        "/order/countSuccessfulShippingOrders"
      );
      setSuccessfulOrders(getSuccess.data.data);
      const getDelivering = await userRequest.get(
        "/order/countShippingOrdersDelivering"
      );
      setDeliveringOrders(getDelivering.data.data);
      const getProfit = await userRequest.get(
        `/order/getTotalRevenueForDay?day=${date.day}&month=${date.month}&year=${date.year}`
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
  }, [date]);
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="adminOverviewContainer">
          <div className="adminOverviewTilesContainer">
            <div className="adminOverviewSumSale">
              <div className="flex items-center mb-5">
                <h3>
                  <TrendingUp fontSize="inherit" /> Doanh thu
                </h3>
                <DatePicker
                  onChange={handleDateChange}
                  defaultValue={dayjs()}
                  className="ml-5"
                />
              </div>
              <div className="adminOverviewWrap grid grid-cols-5">
                <div className="profitChartWrapper col-span-3">
                  <ProfitChart month={date.month} year={date.year} />
                </div>
                <div className="adminOverviewStatistic col-span-2">
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
              <Searchbar
                onInputChange={handleSearchQueryChange}
                placeholderText={"Mã vận đơn"}
              />
            </div>
            <OrderListTableAnt searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
