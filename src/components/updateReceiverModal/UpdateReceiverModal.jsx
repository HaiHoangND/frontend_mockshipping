import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { publicRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

export const UpdateReceiverModal = ({ receiver }) => {
  const navigate = useNavigate();
  const authUser = useAuthUser();
  let [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: receiver.name,
    phone: receiver.phone,
    address: receiver.address,
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleUpdateReceiver = async () => {
    try {
      setIsLoading(true);
      await publicRequest.put(`/receiver/${receiver.id}`, {
        name: inputs.name,
        phone: inputs.phone,
        address: inputs.address,
        shopOwnerId: authUser().id,
      });
      setIsLoading(false);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button icon={<EditOutlined />} type="primary" onClick={openModal} />

      <Modal
        title="Cập nhật khách hàng cũ"
        open={isOpen}
        onOk={handleUpdateReceiver}
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
              placeholder={receiver.name}
              name="name"
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              placeholder={receiver.phone}
              name="phone"
              onChange={handleInputsChange}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              placeholder={receiver.address}
              name="address"
              onChange={handleInputsChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
