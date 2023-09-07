import React from "react";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./warehouseList.scss";
import { WarehouseOutlined } from "@mui/icons-material";
import { WarehouseListTable } from "../../../components/warehouseListTable/WarehouseListTable";

const WarehouseList = () => {
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="warehouseTableContainer">
          <h3>
            <WarehouseOutlined fontSize="inherit" /> Danh sách nhà kho
          </h3>
          <WarehouseListTable/>
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
