import {
  AddShoppingCartOutlined,
  ReceiptLong,
  SummarizeOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { CreateOrderPersonalInfoForm } from "../../../components/createOrderPersonalInfoForm/CreateOrderPersonalInfoForm";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest } from "../../../requestMethods";
import {
  convertCurrency,
  generateOrderCode,
} from "../../../utils/formatStrings";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import "./createOrder.scss";
import { ProductTable } from "../../../components/createOrderProductTable/ProductTable";
import { Button } from "antd";

const CreateOrder = () => {
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const [isValid, setIsValid] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState();
  const [productWeight, setProductWeight] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentShop, setCurrentShop] = useState({});

  const handleReceiverAddressChange = (newAddress) => {
    setReceiverInfo(newAddress);
  };

  const handleProductWeightChange = (newWeight) => {
    setProductWeight(newWeight);
  };
  const handleProductPriceChange = (newPrice) => {
    setProductPrice(newPrice);
  };
  const calculateServiceFee = () => {
    const routeFee = 25000;
    if (productWeight > 5) return routeFee + (routeFee * 30) / 100;
    else return routeFee;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProductChange = (newProducts) => {
    setProducts(newProducts);
  };

  const getCurrentShop = async () => {
    try {
      const res = await publicRequest.get(`/user/${authUser().id}`);
      setCurrentShop(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentShop();
  }, []);

  const handleCreateOrder = async () => {
    try {
      if (!isValid) {
        return useToastError("Thông tin đơn hàng chưa hợp lệ!");
      } else {
        let receiver;
        if (!receiverInfo.id) {
          const receiverData = await publicRequest.post("/receiver", {
            name: receiverInfo.name,
            address: `${receiverInfo.detailedAddress}, ${receiverInfo.districts}`,
            phone: receiverInfo.phone,
            shopOwnerId: authUser().id,
          });
          receiver = receiverData.data.data.id;
        } else {
          receiver = receiverInfo.id;
        }
        // Create order
        const shippingOrder = await publicRequest.post("/order", {
          orderCode: generateOrderCode(),
          shopOwnerId: authUser().id,
          receiverId: receiver,
          serviceFee: calculateServiceFee(),
        });
        // Create routes
        await publicRequest.post("/orderRoute", {
          address: currentShop.address,
          shippingOrderId: shippingOrder.data.data.id,
          routeId: 1,
        });
        await publicRequest.post("/orderRoute", {
          address: receiverInfo.id
            ? receiverInfo.address
            : `${receiverInfo.detailedAddress}, ${receiverInfo.districts}`,
          shippingOrderId: shippingOrder.data.data.id,
          routeId: 2,
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
        navigate("/shop");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (products.length === 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [products]);

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="personalInformationFormContainer">
          <div className="personalInformationFormsWrapper">
            <CreateOrderPersonalInfoForm
              person={"Người nhận"}
              onInputsChange={handleReceiverAddressChange}
              key={"receiver"}
            />
          </div>
        </div>
        <div className="createOrderProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Danh sách sản phẩm
          </h3>
          {/* <CreateOrderProductTable
            onProductWeightChange={handleProductWeightChange}
            onProductPriceChange={handleProductPriceChange}
            onProductChange={handleProductChange}
          /> */}
          <ProductTable />
        </div>
        <div className="orderSummaryCreation">
          <h3>
            <SummarizeOutlined fontSize="inherit" />
            Tóm tắt đơn hàng
          </h3>
          <div className="orderSummaryFeeContainer">
            <span>Phí khoảng cách</span>
            <span>{convertCurrency(25000)}</span>
          </div>
          {productWeight > 5 && (
            <div className="orderSummaryFeeContainer">
              <span>Phí cân nặng</span>
              <span>{convertCurrency(25000 + (25000 * 30) / 100)}</span>
            </div>
          )}
          <div className="orderSummaryFeeContainer">
            <span>Giá trị mặt hàng</span>
            <span>{convertCurrency(productPrice)}</span>
          </div>
          <hr className="createOrderHr" />
          <div className="orderSummaryFeeContainer">
            <span>Tổng giá trị đơn hàng</span>
            <span>{convertCurrency(productPrice + calculateServiceFee())}</span>
          </div>
          <Button style={{ width: "100%" }} className="mt-6" type="primary" onClick={handleCreateOrder}>
            Tạo đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
