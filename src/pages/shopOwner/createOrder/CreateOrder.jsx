import { ReceiptLong, SummarizeOutlined } from "@mui/icons-material";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { CreateOrderPersonalInfoForm } from "../../../components/createOrderPersonalInfoForm/CreateOrderPersonalInfoForm";
import { ProductTable } from "../../../components/createOrderProductTable/ProductTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest, userRequest } from "../../../requestMethods";
import {
  convertCurrency,
  generateOrderCode,
} from "../../../utils/formatStrings";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import "./createOrder.scss";

export const validatePhoneNumber = (number) => {
  const convertedNumber = parseInt(number).toString();
  if (number.substr(1) === convertedNumber) {
    return true;
  } else {
    return false;
  }
};

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

  const handleCustomerChange = () => {
    setReceiverInfo();
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

  console.log(products);
  const validateReceiverInfo = () => {
    if (!receiverInfo) {
      useToastError("Chưa điền thông tin khách hàng");
      return false;
    } else if (!receiverInfo.phone) {
      useToastError("Chưa điền số điện thoại khách hàng");
      return false;
    } else if (!validatePhoneNumber(receiverInfo.phone)) {
      useToastError("Số điện thoại chưa đúng định dạng");
      return false;
    } else if (!receiverInfo.name) {
      useToastError("Chưa điền tên khách hàng");
      return false;
    } else if (
      !receiverInfo.id &&
      (!receiverInfo.detailedAddress || !receiverInfo.districts)
    ) {
      useToastError("Chưa điền địa chỉ khách hàng");
      return false;
    } else {
      return true;
    }
  };

  const validateProductQuantity = (products) => {
    for (const product of products) {
      if (product.shipQuantity === 0) {
        return false;
      } else {
        continue;
      }
    }
    return true;
  };
  // console.log(receiverInfo);
  // console.log(products);
  const validateProductInfo = () => {
    if (products.length === 0) {
      useToastError("Chưa có sản phẩm nào được thêm");
      return false;
    } else if (!validateProductQuantity(products)) {
      useToastError("Số lượng sản phẩm không hợp lệ");
      return false;
    } else {
      return true;
    }
  };
  // console.log(validateProductInfo());

  const handleProductChange = (newProducts) => {
    setProducts(newProducts);
  };

  const getCurrentShop = async () => {
    try {
      const res = await userRequest.get(`/user/${authUser().id}`);
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
      if (!validateReceiverInfo() || !validateProductInfo()) {
        return;
      } else {
        let receiver;
        if (!receiverInfo.id) {
          const receiverData = await userRequest.post("/receiver", {
            name: receiverInfo.name,
            address: `${receiverInfo.detailedAddress}, ${receiverInfo.districts}`,
            phone: receiverInfo.phone,
            shopOwnerId: authUser().id,
          });
          if (receiverData.data.type === "failed") {
            return useToastError(receiverData.data.message);
          } else {
            receiver = receiverData.data.data.id;
          }
        } else {
          receiver = receiverInfo.id;
        }
        // Create order
        const shippingOrder = await userRequest.post("/order", {
          orderCode: generateOrderCode(),
          shopOwnerId: authUser().id,
          receiverId: receiver,
          serviceFee: calculateServiceFee(),
        });
        // Create routes
        await userRequest.post("/orderRoute", {
          address: currentShop.address,
          shippingOrderId: shippingOrder.data.data,
          routeId: 1,
        });
        await userRequest.post("/orderRoute", {
          address: receiverInfo.id
            ? receiverInfo.address
            : `${receiverInfo.detailedAddress}, ${receiverInfo.districts}`,
          shippingOrderId: shippingOrder.data.data,
          routeId: 2,
        });
        // Create products
        for (const product of products) {
          await userRequest.post("/product", {
            name: product.name,
            quantity: product.shipQuantity,
            price: product.price,
            image: product.image,
            weight: product.weight,
            description: product.description,
            productCode: product.productCode,
            shippingOrderId: shippingOrder.data.data,
          });
        }

        for (const product of products) {
          await userRequest.put(`/productShop/${product.id}`, {
            name: product.name,
            quantity: product.quantity - product.shipQuantity,
            price: product.price,
            image: product.image,
            weight: product.weight,
            description: product.description,
            productCode: product.productCode,
            shopOwnerId: authUser().id,
          });
        }
        navigate("/shop");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(products);
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="personalInformationFormContainer">
          <div className="personalInformationFormsWrapper">
            <CreateOrderPersonalInfoForm
              onCustomerChange={handleCustomerChange}
              onInputsChange={handleReceiverAddressChange}
            />
          </div>
        </div>
        <div className="createOrderProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Sản phẩm
          </h3>
          <ProductTable
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
          <Button
            style={{ width: "100%" }}
            className="mt-6"
            type="primary"
            onClick={handleCreateOrder}
          >
            Tạo đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
