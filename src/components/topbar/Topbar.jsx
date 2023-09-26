import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Form, Input, Modal } from "antd";
import { useAuthUser } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import "./topbar.scss";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { useToastError } from "../../utils/toastSettings";

const UpdateUserInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    try {
      const res = await userRequest.get(`/user/${authUser().id}`);
      setInputs({
        email: res.data.data.email,
        fullName: res.data.data.fullName,
        role: res.data.data.role,
        address: res.data.data.address,
        phone: res.data.data.phone,
        gender: res.data.data.gender,
        profilePicture: res.data.data.profilePicture,
        workingStatus: res.data.data.workingStatus,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await userRequest.put(`/user/${authUser().id}`, {
        email: inputs.email,
        fullName: inputs.fullName,
        role: inputs.role,
        address: inputs.address,
        phone: inputs.phone,
        gender: inputs.gender,
        profilePicture: inputs.profilePicture,
        workingStatus: inputs.workingStatus,
      });
      if (res.data.type === "success") {
        setIsLoading(false);
        navigate(0);
      } else {
        useToastError(res.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span onClick={openModal}>
        <InfoCircleOutlined className="mr-2" />
        Cập nhật thông tin
      </span>
      <Modal
        title={"Cập nhật thông tin"}
        open={isOpen}
        onOk={handleConfirm}
        onCancel={closeModal}
        confirmLoading={isLoading}
        cancelText="Hủy"
        okText="Xác nhận"
        width={570}
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
              placeholder={inputs.fullName}
              onChange={handleInputsChange}
              defaultValue={inputs.fullName}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              placeholder={inputs.email}
              onChange={handleInputsChange}
              defaultValue={inputs.email}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              name="phone"
              placeholder={inputs.phone}
              onChange={handleInputsChange}
              defaultValue={inputs.phone}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              name="address"
              placeholder={inputs.address}
              onChange={handleInputsChange}
              defaultValue={inputs.address}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const UpdatePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const validatePassword = () => {
    if (!inputs.password || !inputs.confirmPassword) {
      useToastError("Chưa điền đầy đủ thông tin");
      return false;
    } else if (inputs.password.length < 8) {
      useToastError("Mật khẩu chưa đủ độ dài");
      return false;
    } else if (inputs.password !== inputs.confirmPassword) {
      useToastError("Mật khẩu chưa trùng khớp");
      return false;
    } else {
      return true;
    }
  };
  const handleConfirm = async () => {
    try {
      if (!validatePassword()) {
        return;
      } else {
        setIsLoading(true);
        const res = await userRequest.put(
          `/user/updatePassword?id=${authUser().id}&password=${inputs.password}`
        );
        if (res.data.type === "success") {
          navigate(0);
          setIsLoading(false);
        } else {
          useToastError("Có lỗi xảy ra");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <span onClick={openModal}>
        <QuestionCircleOutlined className="mr-2" />
        Thay đổi mật khẩu
      </span>
      <Modal
        title={"Thay đổi mật khẩu"}
        open={isOpen}
        onOk={handleConfirm}
        onCancel={closeModal}
        confirmLoading={isLoading}
        cancelText="Hủy"
        okText="Xác nhận"
        width={570}
      >
        <Form
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          className="mt-5"
        >
          <Form.Item label="Mật khẩu">
            <Input.Password
              name="password"
              placeholder={inputs.password}
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu">
            <Input.Password
              name="confirmPassword"
              placeholder={inputs.confirmPassword}
              onChange={handleInputsChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export const Topbar = () => {
  const authUser = useAuthUser();
  const [user, setUser] = useState({});
  const pathname = useLocation().pathname.split("/");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get(`/user/${authUser().id}`);
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const items = [
    {
      key: 1,
      label: <UpdateUserInfoModal />,
    },
    {
      key: 2,
      label: <UpdatePasswordModal />,
    },
  ];

  return (
    <div className="topbarContainer">
      <div style={{ fontSize: "17px", paddingLeft: "10px" }}>
        {pathname[1] === "orderDetail" ? `Mã vận đơn: ${pathname[2]}` : ""}
      </div>
      <div className="flex items-center justify-center">
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
          trigger={["click"]}
          className=" cursor-pointer"
        >
          <div>
            <Avatar size={40} icon={<UserOutlined />} className="mr-3" />
            {user.fullName}
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
