import {
  AllInboxRounded,
  BackupTable,
  LocalShippingRounded,
  PeopleAlt,
  ReceiptLong,
} from "@mui/icons-material";
import { OrderListTable } from "../../../components/orderListTable/OrderListTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./coordinatorDashboard.scss";

const CoordinatorDashboard = () => {
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
                <div className="bigNumber">63</div>
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
                <div className="bigNumber">20</div>
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
                <div className="bigNumber">10</div>
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
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
          </h3>
          <OrderListTable />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
