import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import "./updateOrderEmployeeModal.scss";
import { useAuthUser } from "react-auth-kit";
import { getArrayLastItem, getIndexOfItem } from "../../utils/getLastArrayItem";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { publicRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";

export const UpdateOrderEmployeeModal = ({ order }) => {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState("");
  const authUser = useAuthUser();
  const role = authUser().role;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const getShippers = async () => {
    const res = await publicRequest.get(`/user/getShippersWithStatus`);
    const filteredResult = res.data.data.map((item) => item.user);
    setShippers(filteredResult);
  };

  useEffect(() => {
    getShippers();
  }, []);

  const handleShipperChange = (e) => {
    setSelectedShipper(e.target.value);
  };

  const isDisabled = () => {
    if (order.orderStatusList.length === 0) {
      return false;
    }

    // Check if the last status is "Đơn hủy"
    if (order.orderStatusList[0].status === "Đơn hủy") {
      return true;
    }

    if (order.orderStatusList[0].status === "Đã đưa tiền cho chủ shop") {
      return true;
    }

    // Check if the warehouseId matches
    if (authUser().warehouseId === order.orderStatusList[0].warehouse?.id) {
      return false;
    }

    return false;
  };

  console.log(selectedShipper);

  const handleUpdateEmployee = async () => {
    let nextOrderRouteId;
    if (order.orderStatusList.length === 0) {
      nextOrderRouteId = order.orderRoutes[0].id;
    } else {
      nextOrderRouteId = order.orderRoutes[1].id;
    }

    try {
      const res = await publicRequest.post("/orderStatus", {
        shippingOrderId: order.id,
        shipperId: selectedShipper,
        orderRouteId: nextOrderRouteId,
        status:
          order.orderStatusList.length === 0
            ? "Đang lấy hàng"
            : "Đang giao hàng",
        arriving:
          order.orderStatusList.length === 0
            ? true
            : !order.orderStatusList[0].arriving,
      });
      if (res.data.type === "success") {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {role !== "SHOP" ? (
        <button
          onClick={openModal}
          style={{ cursor: "pointer" }}
          className="updateEmployeeModalBtn"
          disabled={isDisabled()}
        >
          Cập nhật nhân viên
        </button>
      ) : (
        <div></div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="text-lg font-medium leading-6 "
                  >
                    Cập nhật nhân viên đảm nhận
                  </Dialog.Title>
                  <div className="mt-2 selectInput">
                    <Select
                      labelId="select-label"
                      value={selectedShipper}
                      onChange={handleShipperChange}
                      defaultValue={
                        shippers.length > 0 ? shippers[0].fullName : ""
                      }
                    >
                      {shippers.map((shipper) => (
                        <MenuItem key={shipper.id} value={shipper.id}>
                          {shipper.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="confirmModalBtns mt-4">
                    <button type="button" onClick={handleUpdateEmployee}>
                      Xác nhận
                    </button>
                    <button type="button" onClick={closeModal}>
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
