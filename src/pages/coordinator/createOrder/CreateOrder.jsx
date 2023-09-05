import {
  AddShoppingCartOutlined,
  East,
  ReceiptLong,
  SummarizeOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { CreateOrderPersonalInfoForm } from "../../../components/createOrderPersonalInfoForm/CreateOrderPersonalInfoForm";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { districts, findBestRoute } from "../../../utils/shortestPath";
import { useToastError } from "../../../utils/toastSettings";
import "./createOrder.scss";

const CreateOrder = () => {
  const [senderAddress, setSenderAddress] = useState();
  const [receiverAddress, setReceiverAddress] = useState();
  const [optimalRoute, setOptimalRoute] = useState([]);

  const handleSenderAddressChange = (newAddress) => {
    setSenderAddress(newAddress);
    setOptimalRoute([]);
  };
  const handleReceiverAddressChange = (newAddress) => {
    setReceiverAddress(newAddress);
    setOptimalRoute([]);
  };

  console.log(senderAddress, receiverAddress);

  const handleGetOptimalRoute = () => {
    if (
      !senderAddress?.district ||
      !receiverAddress?.district ||
      !receiverAddress?.detailedAddress ||
      !senderAddress?.detailedAddress
    )
      return useToastError("Xin hãy điền đầy đủ địa chỉ!");
    const senderAddressId = districts.find(
      (item) => item.district === senderAddress.district
    )?.id;
    const receiverAddressId = districts.find(
      (item) => item.district === receiverAddress.district
    )?.id;
    setOptimalRoute(
      findBestRoute(districts, senderAddressId, receiverAddressId)
    );
  };
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
            <CreateOrderPersonalInfoForm
              person={"Người gửi"}
              onInputsChange={handleSenderAddressChange}
              key={"sender"}
            />
            <CreateOrderPersonalInfoForm
              person={"Người nhận"}
              onInputsChange={handleReceiverAddressChange}
              key={"receiver"}
            />
          </div>
          <div className="createOrderRoutes">
            <button onClick={handleGetOptimalRoute}>
              Tạo lộ trình đơn hàng
            </button>
            {optimalRoute.length > 0 && (
              <span>
                <span className="senderAddress">
                  {senderAddress?.detailedAddress}, {senderAddress?.district}
                </span>
                <East />
                {optimalRoute.map((route, index) => (
                  <div className="middleWarehouse" key={index}>
                    <span>{route}</span>
                    <East />
                  </div>
                ))}
                <span className="receiverAddress">
                  {receiverAddress?.detailedAddress},{" "}
                  {receiverAddress?.district}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="createOrderProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách sản phẩm
          </h3>
          <CreateOrderProductTable />
        </div>
        <div className="orderSummaryCreation">
          <h3>
            <SummarizeOutlined fontSize="inherit" />
            Tóm tắt đơn hàng
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
