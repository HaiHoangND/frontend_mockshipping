import { Dialog, Transition } from "@headlessui/react";
import { Add, AddCircle, Edit, WarningAmber } from "@mui/icons-material";
import { MenuItem, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import "./updateEmployeeInfoModal.scss";
import { publicRequest } from "../../requestMethods";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { useNavigate } from "react-router-dom";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

export const UpdateEmployeeInfoModal = ({ employeeInfo, type }) => {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    fullName: employeeInfo ? employeeInfo.user.fullName : "",
    email: employeeInfo ? employeeInfo.user.email : "",
    password: employeeInfo ? employeeInfo.user.password : "",
    role: employeeInfo ? employeeInfo.user.role : "SHIPPER",
    address: employeeInfo ? employeeInfo.user.address : "",
    gender: employeeInfo ? employeeInfo.user.gender : "Nam",
    phone: employeeInfo ? employeeInfo.user.phone : "",
    workingStatus: employeeInfo ? employeeInfo.user.workingStatus : true,
  });
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

  const handleConfirm = async () => {
    if (type === "add") {
      if (
        !inputs.fullName ||
        !inputs.email ||
        !inputs.password ||
        !inputs.role ||
        !inputs.address ||
        !inputs.gender ||
        !inputs.phone ||
        !inputs.workingStatus
      ) {
        return useToastError("Chưa điền đầy đủ thông tin");
      } else {
        const res = await publicRequest.post("/register", {
          fullName: inputs.fullName,
          email: inputs.email,
          password: inputs.password,
          role: inputs.role,
          address: inputs.address,
          gender: inputs.gender,
          phone: inputs.phone,
          workingStatus: inputs.workingStatus,
        });
        if (res.data.type === "success") {
          useToastSuccess("Tạo nhân viên thành công");
          navigate(0);
          closeModal();
        }
      }
    } else if (type === "update") {
      const res = await publicRequest.put(`/user/${employeeInfo.user.id}`, {
        fullName: inputs.fullName,
        email: inputs.email,
        password: inputs.password,
        role: inputs.role,
        address: inputs.address,
        gender: inputs.gender,
        phone: inputs.phone,
        workingStatus: inputs.workingStatus,
      });
      if (res.data.type === "success") {
        useToastSuccess("Cập nhật nhân viên thành công");
        navigate(0);
        closeModal();
      }
    }
  };

  return (
    <>
      {type === "update" ? (
        <div
          onClick={openModal}
          className="flex justify-center"
          style={{ cursor: "pointer" }}
        >
          <Button type="primary" icon={<EditOutlined />} />
        </div>
      ) : (
        <div className="shipperTableAddEmployeeBtn" onClick={openModal}>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            Thêm mới nhân viên
          </Button>
        </div>
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="text-lg font-medium leading-6 "
                  >
                    {type === "update" ? (
                      <>
                        <Edit />{" "}
                        <p style={{ marginLeft: "10px" }}>Cập nhật thông tin</p>
                      </>
                    ) : (
                      <>
                        <AddCircle />
                        <p style={{ marginLeft: "10px" }}>Thêm mới nhân viên</p>
                      </>
                    )}
                  </Dialog.Title>
                  <div className="mt-2 updateEmployeeInputsWrapper">
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Tên"
                        name="fullName"
                        onChange={handleInputsChange}
                        placeholder={
                          !employeeInfo
                            ? "Trần Phi Long"
                            : employeeInfo.user.fullName
                        }
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        select
                        label="Giới tính"
                        name="gender"
                        defaultValue={
                          !employeeInfo ? "Nam" : employeeInfo.user.gender
                        }
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
                        placeholder={
                          !employeeInfo
                            ? "01234567889"
                            : employeeInfo.user.phone
                        }
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Email"
                        name="email"
                        onChange={handleInputsChange}
                        placeholder={
                          !employeeInfo
                            ? "example@email.com"
                            : employeeInfo.user.email
                        }
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        label="Địa chỉ"
                        name="address"
                        onChange={handleInputsChange}
                        placeholder={
                          !employeeInfo
                            ? "256 Đội Cấn"
                            : employeeInfo.user.address
                        }
                      />
                    </div>
                    <div className="employeeInfoInputContainer">
                      <TextField
                        select
                        label="Trạng thái làm việc"
                        name="workingStatus"
                        defaultValue={
                          !employeeInfo ? true : employeeInfo.user.workingStatus
                        }
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
                        defaultValue={
                          !employeeInfo ? "SHIPPER" : employeeInfo.user.role
                        }
                        onChange={handleInputsChange}
                        sx={{ width: "200px" }}
                      >
                        {authUser().role === "ADMIN" && (
                          <MenuItem value={"COORDINATOR"}>
                            Điều phối viên
                          </MenuItem>
                        )}
                        <MenuItem value={"SHIPPER"}>
                          Nhân viên giao hàng
                        </MenuItem>

                        {authUser().role === "ADMIN" && (
                          <MenuItem value={"ADMIN"}>Quản lí giao hàng</MenuItem>
                        )}
                      </TextField>
                    </div>
                    {type === "add" && (
                      <div className="employeeInfoInputContainer">
                        <TextField
                          label="Mật khẩu"
                          name="password"
                          onChange={handleInputsChange}
                          type="password"
                        />
                      </div>
                    )}
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
