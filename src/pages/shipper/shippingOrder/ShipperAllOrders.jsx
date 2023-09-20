import { KeyboardReturn, WarningAmber, Settings } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { publicRequest, userRequest } from "../../../requestMethods";
import "./ShipperAllOrders.scss";
import {
  getArrayLastItem,
  getIndexOfItem,
} from "../../../utils/getLastArrayItem";
import { useAuthUser, useSignOut } from "react-auth-kit";

const ShipperAllOrders = () => {
  const tabs = ["Chưa hoàn thành", "Hoàn thành"];
  const [type, setType] = useState("Chưa hoàn thành");
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccepted, setAccepted] = useState(false);
  const authUser = useAuthUser();
  const signOut = useSignOut();

  const getStatusColor = (name) => {
    switch (name) {
      case "Đang lấy hàng":
        return "grey";
      case "Lấy hàng thành công":
        return "#f5a41d";
      case "Đang giao hàng":
        return "#f1c40f";
      case "Đơn hàng bị hủy":
        return "#dc3545";
      default:
        return "#07bc0c";
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleVerified = (index) => {
    openModal();
    setIndex(index);
  };

  const handleUpdateFinalStatus = () => {
    if (isAccepted) {
      handleChangeStatus(index);
      getOrders(type);
    }
  };

  const getOrders = async (tab) => {
    console.log(tab);
    if (tab === "Chưa hoàn thành") {
      const res = await userRequest.get(
        `/user/getFilterShippingOrders?shipperId=${authUser().id
        }&statusFilter=unSuccessful`
      );
      console.log(res.data);
      setOrder(res.data.data);
    } else {
      const res = await userRequest.get(
        `/user/getFilterShippingOrders?shipperId=${authUser().id
        }&statusFilter=successful`
      );
      console.log(res.data);
      setOrder(res.data.data);
    }
  };

  useEffect(() => {
    getOrders(type);
  }, [type]);

  useEffect(() => {
    handleUpdateFinalStatus();
  }, [isAccepted]);

  const handleChangeStatus = async (index) => {
    if (index !== null) {
      let lastestStatus = getArrayLastItem(order[index].orderStatusList);
      let routeLength = order[index].orderRoutes.length;
      let status = "";
      let nextLocation = "";
      let nextOrderRouteId;
      let checkArriving = lastestStatus.arriving;
      console.log(checkArriving);
      console.log(lastestStatus);
      let currentOrderRouteId = lastestStatus.orderRoute.routeId;
      let currentOrderRouteIndex = getIndexOfItem(
        order[index].orderRoutes,
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
          nextLocation = order[index].orderRoutes[currentOrderRouteId].address;
          status = "Đang giao hàng";
          nextOrderRouteId = currentOrderRouteIndex + 1;
        }
      } else {
        nextLocation = order[index].orderRoutes[currentOrderRouteId].address;
        status = "Đang giao hàng";
        nextOrderRouteId = currentOrderRouteIndex + 1;
      }
      try {
        const res = await userRequest.post("/orderStatus", {
          shippingOrderId: order[index].id,
          shipperId: lastestStatus.shipper.id,
          orderRouteId: order[index].orderRoutes[nextOrderRouteId].id,
          status: status,
          arriving: !lastestStatus.arriving,
        });
      } catch (error) {
        console.log(error);
      }
      setAccepted(false);
      closeModal();
    }
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
                    className="text-lg font-medium leading-6 text-yellow-900 m-0"
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
                    <button type="button" className="border-none cursor-pointer" onClick={() => setAccepted(true)}>
                      Xác nhận
                    </button>
                    <button type="button" className="border-none cursor-pointer" onClick={() => closeModal()}>
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="orderContainer">
        <div className="topMenu">
          <div className="topMenuTitle">Đơn hàng</div>
          <div className="topMenuButton">
            {tabs.map((tab) => (
              <button
                onClick={() => setType(tab)}
                style={
                  type === tab
                    ? {
                      color: "white",
                      backgroundColor: "#0088ff",
                    }
                    : {}
                }
                key={tab}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="topMenuDate">Danh sách đơn hàng</div>
        </div>
        <div className="orderScroll">
          {order.map((order, index) => (
            <div className="orderList" key={order.id}>
              <div className="orderListItem">
                <Link to={`/shipper/shipperOrderDetail/${order.orderCode}`}>
                  <div className="orderTop">
                    <div className="orderDate">
                      <div className="orderDay">
                        {order.createdAt[2]}/{order.createdAt[1]}
                      </div>
                      <div className="orderMonth">{order.createdAt[0]}</div>
                    </div>
                    <div className="orderInfo">
                      <div className="userAddress">
                        {order.receiver.address}
                      </div>
                      <div className="userName">{order.receiver.name}</div>
                      <div className="userPhone">{order.receiver.phone}</div>
                    </div>
                    <div
                      className="orderCurrentStatus"
                      style={{
                        backgroundColor: getStatusColor(
                          getArrayLastItem(order.orderStatusList).status
                        ),
                      }}
                    >
                      {getArrayLastItem(order.orderStatusList).status}
                    </div>
                  </div>
                </Link>
                <div className="orderChangeStatus">
                  <Button
                    variant="contained "
                    onClick={() => handleVerified(index)}
                    disabled={type === "Hoàn thành" ? true : false}
                    style={
                      type === "Hoàn thành"
                        ? {
                          backgroundColor: "grey",
                        }
                        : {}
                    }
                  >
                    Chuyển trạng thái
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="botBar">
          <div className="botBarItem" onClick={() => signOut()}>
            <KeyboardReturn /> Đăng xuất
          </div>

          <div className="botBarItem">
            <Link to={`/shipper/shipperPersonalInfo/${authUser().id}`}>
              <Settings />
            </Link>
            Tài khoản
          </div>
        </div>
      </div>
    </>
  );
};

export default ShipperAllOrders;
