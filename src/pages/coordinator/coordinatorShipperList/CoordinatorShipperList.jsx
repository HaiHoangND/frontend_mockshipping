import { AddCircle, ReceiptLong } from "@mui/icons-material";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./coordinatorShipperList.scss";
import { ShippersTable } from "../../../components/shippersTable/ShippersTable";
import { useEffect, useState } from "react";
import { publicRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { UpdateEmployeeInfoModal } from "../../../components/updateEmployeeInfoModal/UpdateEmployeeInfoModal";
import { Searchbar } from "../../../components/searchbar/Searchbar";

const CoordinatorShipperList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />

        <div className="shippersTableContainer">
          <div className="titleWrapper">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách nhân viên
            </h3>
            <div className="modalWrapper">
              <Searchbar
                onInputChange={handleSearchQueryChange}
                placeholderText={"Tìm kiếm nhân viên"}
              />
              <UpdateEmployeeInfoModal type={"add"} />
            </div>
          </div>
          <ShippersTable searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorShipperList;
