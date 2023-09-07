import { ReceiptLong } from "@mui/icons-material";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./coordinatorShipperList.scss";
import { ShippersTable } from "../../../components/shippersTable/ShippersTable";
import { useEffect, useState } from "react";
import { publicRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";

const CoordinatorShipperList = () => {
  const authUser = useAuthUser();
  const warehouseId = authUser().warehouseId;
  const [shippers, setShippers] = useState([]);

  const getShippers = async () => {
    try {
      const res = await publicRequest.get(
        `/warehouse/getShippersWithStatus?warehouseId=${warehouseId}`
      );
      setShippers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShippers();
  }, []);
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        {shippers.length !== 0 && (
          <div className="shippersTableContainer">
            <h3>
              <ReceiptLong fontSize="inherit" /> Danh sách nhân viên
            </h3>
            <ShippersTable shipperData={shippers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorShipperList;
