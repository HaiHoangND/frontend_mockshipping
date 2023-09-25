import React, { useState } from "react";
import "./orderList.scss";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { ReceiptLong } from "@mui/icons-material";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { OrderListTableAnt } from "../../../components/orderListTable/OrderListTableAnt";

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="orderListContainer">
          <div className="flex items-center justify-between mb-5">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
            </h3>
            <Searchbar
              onInputChange={handleSearchQueryChange}
              placeholderText={"Tìm kiếm đơn hàng"}
            />
          </div>
          <OrderListTableAnt searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
