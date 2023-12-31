import {
  ArrowBackIosNew,
  Place,
  Person,
  Home,
  Call,
  WarningAmber,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

import "./shipperOrderDetail.scss";
import { Fragment, useState, useEffect } from "react";
import { publicRequest, userRequest } from "../../../requestMethods";
import {
  getArrayLastItem,
  getIndexOfItem,
} from "../../../utils/getLastArrayItem";
import { convertCurrency } from "../../../utils/formatStrings";

const ShipperOrderDetail = () => {
  const shippingOrderCode = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccepted, setAccepted] = useState(false);
  const [statusButton, setStatusButton] = useState("");
  console.log(shippingOrderCode);
  console.log(orderInfo);
  const getSumOfItemPrice = (array) => {
    let sumOfOrderPrice = 0;
    if (array && array.length !== 0) {
      for (let i = 0; i < array.length; ++i) {
        sumOfOrderPrice += array[i].price * array[i].quantity;
      }
      console.log(sumOfOrderPrice);
    }
    return sumOfOrderPrice;
  };

  const getOrderDetail = async () => {
    const res = await userRequest.get(
      `/order/getByCode?orderCode=${shippingOrderCode}`
    );
    console.log(res);
    setOrderInfo(res.data.data);
    if (res) {
      setStatusButton(getArrayLastItem(res.data.data.orderStatusList.status));
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  const handleUpdateFinalStatus = () => {
    if (isAccepted) {
      handleChangeStatus();
      navigate("/shipper");
    }
  };

  useEffect(() => {
    handleUpdateFinalStatus();
  }, [isAccepted]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleChangeStatus = async () => {
    let lastestStatus = getArrayLastItem(orderInfo.orderStatusList);
    let routeLength = orderInfo.orderRoutes.length;
    let status = "";
    let nextLocation = "";
    let nextOrderRouteId;
    let checkArriving = lastestStatus.arriving;
    console.log(checkArriving);
    console.log(lastestStatus);
    let currentOrderRouteId = lastestStatus.orderRoute.routeId;
    let currentOrderRouteIndex = getIndexOfItem(
      orderInfo.orderRoutes,
      lastestStatus.orderRoute.id
    );
    if (currentOrderRouteIndex === routeLength - 1 && checkArriving) {
      nextLocation = "";
      status = "Giao hàng thành công";
      nextOrderRouteId = currentOrderRouteIndex;
    } else if (checkArriving) {
      if (currentOrderRouteId === 1) {
        nextLocation = lastestStatus.nextLocation;
        status = "Lấy hàng thành công";
        nextOrderRouteId = currentOrderRouteIndex;
      } else {
        nextLocation = orderInfo.orderRoutes[currentOrderRouteId].address;
        status = "Đang giao hàng";
        nextOrderRouteId = currentOrderRouteIndex + 1;
      }
    } else {
      nextLocation = orderInfo.orderRoutes[currentOrderRouteId].address;
      status = "Đang giao hàng";
      nextOrderRouteId = currentOrderRouteIndex + 1;
    }
    try {
      const res = await userRequest.post("/orderStatus", {
        shippingOrderId: orderInfo.id,
        shipperId: lastestStatus.shipper.id,
        nextLocation: nextLocation,
        orderRouteId: orderInfo.orderRoutes[nextOrderRouteId].id,
        status: status,
        arriving: !lastestStatus.arriving,
      });
      // console.log(currentOrderRouteIndex);
      // console.log(nextOrderRouteId);
      // console.log(order[index].orderRoutes);
      // console.log(order[index].orderRoutes[nextOrderRouteId].id);
      // console.log(nextOrderRouteId);
      // console.log(currentOrderRouteId);
    } catch (error) {
      console.log(error);
    }
    // setAccepted(false);
    closeModal();
  };

  const canChangeStatus = () => {
    if (
      getArrayLastItem(orderInfo.orderStatusList).status ===
        "Giao hàng thành công" ||
      getArrayLastItem(orderInfo.orderStatusList).status ===
        "Quản lý đã nhận tiền" ||
      getArrayLastItem(orderInfo.orderStatusList).status ===
        "Đã đưa tiền cho chủ shop"
    ) {
      return false;
    } else return true;
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-yellow-900"
                  >
                    <WarningAmber /> Cảnh báo
                  </Dialog.Title>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Bạn có chắc muốn chuyển trạng thái đơn hàng ?
                  </Dialog.Title>

                  <div className="confirmModalBtns mt-4">
                    <button type="button" onClick={() => setAccepted(true)}>
                      Xác nhận
                    </button>
                    <button type="button" onClick={() => closeModal()}>
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="topOrderMenu">
        <div className="backToAllOrders">
          <Link to="/shipper">
            <div className="backArrow">
              <ArrowBackIosNew />
            </div>
          </Link>
          <div className="backTitle">Chi tiết đơn hàng</div>
        </div>
      </div>
      {orderInfo && orderInfo.length !== 0 && (
        <div className="orderDetailContainer">
          {/* <div className='orderInfo'>
                        <div className='orderTitle'>Giao tới</div>
                        <div className='orderItem'>
                            <Place /> {orderInfo && orderInfo.orderStatusList &&
                                getArrayLastItem(orderInfo.orderStatusList).orderRoute.address
                            }
                        </div>
                    </div> */}

          <div className="orderInfo">
            <div className="orderTitle">Thông tin người nhận</div>
            <div className="orderItem">
              <Person /> {orderInfo.receiver?.name}
            </div>
            <div className="orderItem">
              <Home /> {orderInfo.receiver?.address}
            </div>
            <div className="orderItem">
              <Call /> {orderInfo.receiver?.phone}
            </div>
          </div>

          <div className="orderInfo">
            <div className="orderTitle">Mặt hàng</div>
            {orderInfo &&
              orderInfo.products &&
              orderInfo.products.map((orderDetail, index) => (
                <div className="orderItemList" key={index}>
                  <div className="orderImage">
                    <img src={orderDetail.image} />
                  </div>
                  <div className="orderDetailInfo">
                    <div className="orderItemName">{orderDetail.name}</div>
                    <div className="orderItemQuantity">
                      Số lượng: {orderDetail.quantity}
                    </div>
                    <div className="orderItemWeight">
                      Cân nặng: {orderDetail.weight}kg
                    </div>
                    <div className="orderItemPrice">
                      {convertCurrency(orderDetail.price)}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="orderPayment">
            <div className="orderTitle">Thông tin thanh toán</div>
            <div className="paymentInfo">
              <div className="paymentTitle">Giá trị mặt hàng</div>
              <div className="paymentPrice">
                {orderInfo &&
                  orderInfo.products &&
                  convertCurrency(getSumOfItemPrice(orderInfo.products))}
              </div>
            </div>
            <div className="paymentInfo">
              <div className="paymentTitle">Phí dịch vụ</div>
              <div className="paymentPrice">
                {convertCurrency(orderInfo?.serviceFee)}
              </div>
            </div>
          </div>
          <div className="totalPayment">
            <div className="paymentTitle">Tổng tiền phải thu</div>
            <div className="paymentTotalPrice">
              {orderInfo &&
                orderInfo.products &&
                convertCurrency(
                  orderInfo?.serviceFee + getSumOfItemPrice(orderInfo.products)
                )}
            </div>
          </div>
          {canChangeStatus() && (
            <div className="orderChangeStatus">
              <Button
                variant="contained"
                disabled={statusButton === "Hoàn thành" ? true : false}
                onClick={() => openModal()}
              >
                Chuyển trạng thái
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShipperOrderDetail;
