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
  const authUser = useAuthUser();
  const [page, setPage] = useState(1);
  const [shippers, setShippers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };
  console.log(searchQuery);
  const getShippers = async () => {
    try {
      const res = await publicRequest.get(
        `/user/getAllShippers?pageNumber=${page}&pageSize=10&keyWord=${searchQuery}`
      );
      setShippers(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShippers();
  }, [searchQuery]);
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
          <ShippersTable shipperData={shippers} />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorShipperList;
