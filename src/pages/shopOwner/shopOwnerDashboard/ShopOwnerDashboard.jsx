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
import { publicRequest } from "../../../requestMethods";
import { convertCurrency } from "../../../utils/formatStrings";
import "./shopOwnerDashboard.scss";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { OrderListTableAnt } from "../../../components/orderListTable/OrderListTableAnt";
import { ShopOwnerChart } from "../../../components/shopOwnerChart/ShopOwnerChart";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ShopOwnerDashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [profit, setProfit] = useState([]);
  const authUser = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };
  const currentDate = new Date();
  const currentDay = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad it with leading zeros if needed
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (Note: Month is zero-based, so we add 1) and pad it
  const currentYear = currentDate.getFullYear();

  const [date, setDate] = useState({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  });

  const handleDateChange = (date) => {
    setDate({
      day: date.$D,
      month: date.$M + 1,
      year: date.$y,
    });
  };

  const handleProfitData = (newProfit) => {
    setProfit(newProfit);
  };

  const getStats = async () => {
    const stats = await publicRequest.get(
      `order/shopOwnerStatistic?shopOwnerId=${authUser().id}`
    );
    setStatistics(stats.data.data[0]);
  };
  useEffect(() => {
    getStats();
  }, []);

  const displayProfitPerDay = (profits, currentDay) => {
    const profitObj = profits.find((day) => day.date === currentDay);
    return profitObj ? profitObj.profit : 0;
  };

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="shopOwnerDashboardOverviewContainer">
          <div className="flex mb-5">
            <h3>
              <BackupTable fontSize="inherit" /> Tổng quan
            </h3>
            <DatePicker
              onChange={handleDateChange}
              defaultValue={dayjs()}
              className="ml-5"
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <ShopOwnerChart
                month={date.month}
                year={date.year}
                onProfitDataChange={handleProfitData}
              />
            </div>
            <div className="shopOwnerOverviewTilesContainer col-span-2">
              <div className="flex justify-between gap-5">
                <div className="shopOwnerOverviewTile flex-1">
                  <div className="left">
                    <span>Tổng đơn hàng</span>
                    <div className="bigNumber">{statistics.ShippingOrders}</div>
                  </div>
                  <div className="right">
                    <AllInboxRounded
                      style={{
                        backgroundColor: "#0d99ff",
                        borderColor: "#0d99ff",
                      }}
                    />
                  </div>
                </div>
                <div className="shopOwnerOverviewTile flex-1" >
                  <div className="left">
                    <span>Đang vận chuyển</span>
                    <div className="bigNumber">{statistics.Delivering}</div>
                  </div>
                  <div className="right">
                    <LocalShippingRounded
                      style={{
                        backgroundColor: "#ffcd29",
                        borderColor: "#ffcd29",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="shopOwnerOverviewTile col-span-2">
                <div className="left">
                  <span>Doanh thu trong ngày</span>
                  <div className="bigNumber">
                    {convertCurrency(displayProfitPerDay(profit, date.day))}
                  </div>
                </div>
                <div className="right">
                  <DoneAll
                    style={{
                      backgroundColor: "#14ae5c",
                      borderColor: "#14ae5c",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shopOwnerOrderListTableContainer">
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
  );
};

export default ShopOwnerDashboard;
