import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { publicRequest, userRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";
import { validatePhoneNumber } from "../../pages/shopOwner/createOrder/CreateOrder";
import { useToastError } from "../../utils/toastSettings";
import { useAuthUser } from "react-auth-kit";

export const AddReceiverModal = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
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
    if (!inputs.name || !inputs.address || !inputs.phone) {
      return useToastError("Chưa điền đủ thông tin");
    } else if (!validatePhoneNumber(inputs.phone)) {
      return useToastError("Số điện thoại sai định dạng");
    } else {
      try {
        setIsLoading(true);
        const res = await userRequest.post("/receiver", {
          name: inputs.name,
          phone: inputs.phone,
          address: inputs.address,
          shopOwnerId: authUser().id,
        });
        if (res.data.type === "success") {
          setIsLoading(false);
          navigate(0);
        } else {
          setIsLoading(false);
          return useToastError(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(inputs);
  return (
    <>
      <Button icon={<PlusCircleOutlined />} type="primary" onClick={openModal}>
        Thêm khách hàng
      </Button>

      <Modal
        title="Thêm khách hàng mới"
        open={isOpen}
        onOk={handleConfirm}
        onCancel={closeModal}
        cancelText="Hủy"
        okText="Xác nhận"
        width={500}
        confirmLoading={isLoading}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          layout="horizontal"
          className="mt-5"
        >
          <Form.Item label="Tên">
            <Input
              placeholder="Trần Phi Long"
              name="name"
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              placeholder="0988759374"
              name="phone"
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              placeholder="256 Đội Cấn, Ba Đình"
              name="address"
              onChange={handleInputsChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
