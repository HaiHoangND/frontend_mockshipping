import {
  AddShoppingCartOutlined,
  East,
  ReceiptLong,
  SummarizeOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CreateOrderPersonalInfoForm } from "../../../components/createOrderPersonalInfoForm/CreateOrderPersonalInfoForm";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { districts, findBestRoute } from "../../../utils/shortestPath";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import "./createOrder.scss";
import { convertCurrency } from "../../../utils/formatStrings";
import { publicRequest, userRequest } from "../../../requestMethods";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [senderInfo, setSenderInfo] = useState();
  const [receiverInfo, setReceiverInfo] = useState();
  const [optimalRoute, setOptimalRoute] = useState([]);
  const [productWeight, setProductWeight] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const handleSenderInfoChange = (newAddress) => {
    setSenderInfo(newAddress);
    setOptimalRoute([]);
  };
  const handleReceiverAddressChange = (newAddress) => {
    setReceiverInfo(newAddress);
    setOptimalRoute([]);
  };

  const handleProductWeightChange = (newWeight) => {
    setProductWeight(newWeight);
  };
  const handleProductPriceChange = (newPrice) => {
    setProductPrice(newPrice);
  };
  const calculateServiceFee = () => {
    const routeFee = 25000 + (optimalRoute.length - 1) * 5000;
    if (productWeight > 5) return routeFee + (routeFee * 30) / 100;
    else return routeFee;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetOptimalRoute = () => {
    if (
      !senderInfo?.name ||
      !receiverInfo?.name ||
      !receiverInfo?.phone ||
      !senderInfo?.phone ||
      !senderInfo?.email ||
      !receiverInfo?.email ||
      !senderInfo?.district ||
      !receiverInfo?.district ||
      !receiverInfo?.detailedAddress ||
      !senderInfo?.detailedAddress
    ) {
      return useToastError("Xin hãy điền đầy đủ địa chỉ!");
    } else if (
      senderInfo?.phone !== parseInt(senderInfo?.phone).toString() ||
      receiverInfo?.phone !== parseInt(receiverInfo?.phone).toString()
    ) {
      return useToastError("Số điện thoại sai định dạng");
    } else if (
      !validateEmail(senderInfo?.email) ||
      !validateEmail(senderInfo?.email)
    ) {
      return useToastError("Email sai định dạng");
    }
    const senderAddressId = districts.find(
      (item) => item.district === senderInfo.district
    )?.id;
    const receiverAddressId = districts.find(
      (item) => item.district === receiverInfo.district
    )?.id;
    setOptimalRoute(
      findBestRoute(districts, senderAddressId, receiverAddressId)
    );
  };

  const handleProductChange = (newProducts) => {
    setProducts(newProducts);
  };

  const handleCreateOrder = async () => {
    try {
      if (!isValid) {
        return useToastError("Thông tin đơn hàng chưa hợp lệ!");
      } else {
        // Create sender
        const sender = await publicRequest.post("/sender", {
          name: senderInfo.name,
          address: `${senderInfo.detailedAddress}, ${senderInfo.district}`,
          phone: senderInfo.phone,
        });
        // Create receiver
        const receiver = await publicRequest.post("/receiver", {
          name: receiverInfo.name,
          address: `${receiverInfo.detailedAddress}, ${receiverInfo.district}`,
          phone: receiverInfo.phone,
        });
        console.log(receiver.data);
        // Create order
        const shippingOrder = await publicRequest.post("/order", {
          orderCode: v4(),
          senderId: sender.data.data.id,
          receiverId: receiver.data.data.id,
          serviceFee: calculateServiceFee(),
        });
        // Create routes
        await publicRequest.post("/orderRoute", {
          address: `${senderInfo.detailedAddress}, ${senderInfo.district}`,
          warehouseId: 2,
          shippingOrderId: shippingOrder.data.data.id,
          routeId: 1,
        });
        for (const route of optimalRoute) {
          const routeId = optimalRoute.indexOf(route) + 2;
          await publicRequest.post("/orderRoute", {
            address: route.name,
            warehouseId: route.id,
            shippingOrderId: shippingOrder.data.data.id,
            routeId,
          });
        }
        await publicRequest.post("/orderRoute", {
          address: `${receiverInfo.detailedAddress}, ${receiverInfo.district}`,
          warehouseId: 3,
          shippingOrderId: shippingOrder.data.data.id,
          routeId: optimalRoute.length + 2,
        });
        // Create products
        for (const product of products) {
          await publicRequest.post("/product", {
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            image: product.image,
            weight: product.weight,
            description: product.description,
            shippingOrderId: shippingOrder.data.data.id,
          });
        }

        useToastSuccess("Order created");
        navigate("/coordinator");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (optimalRoute.length === 0 || products.length === 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [optimalRoute, products]);

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
              onInputsChange={handleSenderInfoChange}
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
                  {senderInfo?.detailedAddress}, {senderInfo?.district}
                </span>
                <East />
                {optimalRoute.map((route, index) => (
                  <div className="middleWarehouse" key={index}>
                    <span>{route.name}</span>
                    <East />
                  </div>
                ))}
                <span className="receiverAddress">
                  {receiverInfo?.detailedAddress}, {receiverInfo?.district}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="createOrderProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách sản phẩm
          </h3>
          <CreateOrderProductTable
            onProductWeightChange={handleProductWeightChange}
            onProductPriceChange={handleProductPriceChange}
            onProductChange={handleProductChange}
          />
        </div>
        <div className="orderSummaryCreation">
          <h3>
            <SummarizeOutlined fontSize="inherit" />
            Tóm tắt đơn hàng
          </h3>
          <div className="orderSummaryFeeContainer">
            <span>Phí dịch vụ</span>
            <span>{convertCurrency(calculateServiceFee())}</span>
          </div>
          <div className="orderSummaryFeeContainer">
            <span>Giá trị mặt hàng</span>
            <span>{convertCurrency(productPrice)}</span>
          </div>
          <hr className="createOrderHr" />
          <div className="orderSummaryFeeContainer">
            <span>Tổng giá trị đơn hàng</span>
            <span>{convertCurrency(productPrice + calculateServiceFee())}</span>
          </div>
          <div className="createOrderBtn">
            <button onClick={handleCreateOrder}>Tạo đơn hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
