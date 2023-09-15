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
import { Button, Form, Input, Modal, Row, Select, Space, Tag } from "antd";

const { Option } = Select;
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
  const role = authUser().role;

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
        navigate(0);
        closeModal();
      }
    }
  };

  const handleRoleChange = (value) => {
    setInputs({ ...inputs, role: value });
  };
  const handleGenderChange = (value) => {
    setInputs({ ...inputs, gender: value });
  };
  const handleWorkingStatusChange = (value) => {
    setInputs({ ...inputs, workingStatus: value });
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
      <Modal
        title={type === "update" ? "Cập nhật thông tin" : "Thêm mới nhân viên"}
        open={isOpen}
        onOk={handleConfirm}
        onCancel={closeModal}
        cancelText="Hủy"
        okText="Xác nhận"
        width={590}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          className="mt-5"
        >
          <Form.Item label="Tên">
            <Input
              name="fullName"
              placeholder={employeeInfo ? inputs.fullName : "Trần Phi Long"}
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Giới tính">
            <Select
              placeholder={employeeInfo ? inputs.gender : "Nam"}
              onChange={handleGenderChange}
              defaultValue={"Nam"}
            >
              <Option value={"Nam"} label={"Nam"}>
                <Space>Nam</Space>
              </Option>
              <Option value={"Nữ"} label={"Nữ"}>
                <Space>Nữ</Space>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              name="phone"
              placeholder={employeeInfo ? inputs.phone : "0123456789"}
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              placeholder={employeeInfo ? inputs.email : "example@email.com"}
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              name="address"
              placeholder={
                employeeInfo ? inputs.address : "256 Đội Cấn, Ba Đình"
              }
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Chức vụ">
            <Select
              placeholder={employeeInfo ? inputs.role : "Nhân viên giao vận"}
              onChange={handleRoleChange}
            >
              <Option value={"SHIPPER"} label={"Nhân viên giao vận"}>
                <Space>Nhân viên giao vận</Space>
              </Option>
              {role === "ADMIN" && (
                <Option value={"COORDINATOR"} label={"Điều phối viên"}>
                  <Space>Điều phối viên</Space>
                </Option>
              )}
              {role === "ADMIN" && (
                <Option value={"ADMIN"} label={"Quản lí giao hàng"}>
                  <Space>Quản lí giao hàng</Space>
                </Option>
              )}
            </Select>
          </Form.Item>
          {type === "update" && (
            <Form.Item label="Trạng thái">
              <Select
                onChange={handleWorkingStatusChange}
                defaultValue={employeeInfo?.user.workingStatus}
              >
                <Option value={true} label={"Đang làm việc"}>
                  <Space>
                    <Tag color="green">Đang làm việc</Tag>
                  </Space>
                </Option>
                <Option value={false} label={"Nghỉ việc"}>
                  <Space>
                    <Tag color="volcano">Nghỉ việc</Tag>
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item label="Mật khẩu">
            <Input.Password name="password" onChange={handleInputsChange} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
