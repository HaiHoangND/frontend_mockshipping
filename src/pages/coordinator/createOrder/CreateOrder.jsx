import { AddShoppingCartOutlined, ReceiptLong } from "@mui/icons-material";
import { CreateOrderPersonalInfoForm } from "../../../components/createOrderPersonalInfoForm/CreateOrderPersonalInfoForm";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import "./createOrder.scss";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";

const CreateOrder = () => {
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="personalInformationFormContainer">
          <h3>
            <AddShoppingCartOutlined fontSize="inherit" /> Tạo đơn hàng
          </h3>
          <div className="personalInformationFormsWrapper">
            <CreateOrderPersonalInfoForm person={"Người gửi"} />
            <CreateOrderPersonalInfoForm person={"Người nhận"} />
          </div>
        </div>
        <div className="createOrderProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách sản phẩm
          </h3>
          <CreateOrderProductTable/>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
