import { Dialog, Transition } from "@headlessui/react";
import { Edit, WarningAmber } from "@mui/icons-material";
import { MenuItem, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import "./updateEmployeeInfoModal.scss"

export const UpdateEmployeeInfoModal = ({ employeeInfo }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const authUser = useAuthUser();

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleConfirm = () => {
    closeModal();
  };

  return (
    <>
      <div
        onClick={openModal}
        className="flex justify-center"
        style={{ cursor: "pointer" }}
      >
        <button
          style={{
            backgroundColor: "#0d99ff",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <Edit />
        </button>
      </div>

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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="text-lg font-medium leading-6 "
                  >
                    <Edit />{" "}
                    <p style={{ marginLeft: "10px" }}>Cập nhật thông tin</p>
                  </Dialog.Title>
                  <div className="mt-2 updateEmployeeInputsWrapper">
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Tên"
                        name="fullName"
                        onChange={handleInputsChange}
                        placeholder={employeeInfo.user.fullName}
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        select
                        label="Giới tính"
                        name="gender"
                        defaultValue={employeeInfo.user.gender}
                        onChange={handleInputsChange}
                        sx={{ width: "200px" }}
                      >
                        <MenuItem value={"Nam"}>Nam</MenuItem>
                        <MenuItem value={"Nữ"}>Nữ</MenuItem>
                      </TextField>
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Số điện thoại"
                        name="phone"
                        onChange={handleInputsChange}
                        placeholder={employeeInfo.user.phone}
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Email"
                        name="email"
                        onChange={handleInputsChange}
                        placeholder={employeeInfo.user.email}
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Địa chỉ"
                        name="address"
                        onChange={handleInputsChange}
                        placeholder={employeeInfo.user.address}
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        select
                        label="Trạng thái làm việc"
                        name="workingStatus"
                        defaultValue={employeeInfo.user.workingStatus}
                        onChange={handleInputsChange}
                        sx={{ width: "200px" }}
                      >
                        <MenuItem value={true}>Đang làm việc</MenuItem>
                        <MenuItem value={false}>Đình chỉ</MenuItem>
                      </TextField>
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        select
                        label="Chức vụ"
                        name="role"
                        defaultValue={employeeInfo.user.role}
                        onChange={handleInputsChange}
                        sx={{ width: "200px" }}
                      >
                        <MenuItem value={"COORDINATOR"}>
                          Điều phối viên
                        </MenuItem>
                        <MenuItem value={"SHIPPER"}>
                          Nhân viên giao hàng
                        </MenuItem>
                        {authUser().role === "ADMIN" && (
                          <MenuItem value={"ADMIN"}>Quản lí giao hàng</MenuItem>
                        )}
                      </TextField>
                    </div>
                  </div>

                  <div className="confirmModalBtns mt-4">
                    <button type="button" onClick={handleConfirm}>
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
