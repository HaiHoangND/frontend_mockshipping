import {
  AllInboxRounded,
  BackupTable,
  LocalShippingRounded,
  PeopleAlt,
  ReceiptLong,
} from "@mui/icons-material";
import { OrderListTableAnt } from "../../../components/orderListTable/OrderListTableAnt";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./coordinatorDashboard.scss";
import { useEffect, useState } from "react";
import { publicRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { Searchbar } from "../../../components/searchbar/Searchbar";

const CoordinatorDashboard = () => {
  const authUser = useAuthUser();
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const getStats = async () => {
    const res = await publicRequest.get(`/order/coordinatorStatistic`);
    setStats(res.data.data[0]);
  };
  useEffect(() => {
    getStats();
  }, []);

  console.log(searchQuery);
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="coordinatorOverviewContainer">
          <h3>
            <BackupTable fontSize="inherit" /> Tổng quan
          </h3>
          <div className="coordinatorOverviewTilesContainer">
            <div className="coordinatorOverviewTile">
              <div className="left">
                <span>Tổng đơn hàng</span>
                <div className="bigNumber">{stats.ShippingOrders}</div>
              </div>
              <div className="right">
                <AllInboxRounded
                  style={{ backgroundColor: "#0d99ff", borderColor: "#0d99ff" }}
                />
              </div>
            </div>
            <div className="coordinatorOverviewTile">
              <div className="left">
                <span>Đang vận chuyển</span>
                <div className="bigNumber">{stats.Delivering}</div>
              </div>
              <div className="right">
                <LocalShippingRounded
                  style={{ backgroundColor: "#ffcd29", borderColor: "#ffcd29" }}
                />
              </div>
            </div>
            <div className="coordinatorOverviewTile">
              <div className="left">
                <span>Nhân viên có sẵn</span>
                <div className="bigNumber">{stats.Shippers}</div>
              </div>
              <div className="right">
                <PeopleAlt
                  style={{ backgroundColor: "#14ae5c", borderColor: "#14ae5c" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="coordinatorOrderListTableContainer">
          <div className="titleWrapper">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
            </h3>
            <Searchbar
              onInputChange={handleSearchQueryChange}
              placeholderText={"Mã vận đơn"}
            />
          </div>
          <OrderListTableAnt />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
