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
import {ProfitChart} from "../../../components/profitChart/ProfitChart"

const AdminDashboard = () => {
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
              <ProfitChart/>
            </div>
            <div className="adminOverviewStatistic">
              <div className="adminStatisticOrders">
                <div className="adminStatisticOrder">
                  <div className="left">
                    <span>Đơn đang giao</span>
                    <div className="bigNumber">63</div>
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
                    <div className="bigNumber">63</div>
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
                  <div className="bigNumber">3.000.000 đ</div>
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
          <div className="adminListTableContainer">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
            </h3>
            <OrderListTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
