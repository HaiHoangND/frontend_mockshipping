import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./coordinatorShipperList.scss";

const CoordinatorShipperList = () => {
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
      </div>
    </div>
  );
};

export default CoordinatorShipperList;
