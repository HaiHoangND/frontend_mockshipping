import { Person } from "@mui/icons-material";
import { Col, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { districtNames } from "../../utils/formatStrings";
import { OldCustomerTable } from "../oldCustomerTable/OldCustomerTable";
import "./createOrderPersonalInfoForm.scss";

export const CreateOrderPersonalInfoForm = ({ person, onInputsChange }) => {
  const [customerType, setCustomerType] = useState("oldCustomer");
  const [form] = Form.useForm();
  const [inputs, setInputs] = useState({
    districts: customerType === "oldCustomer" ? "" : "Ba Đình",
  });

  const handleCustomerTypeChange = (newCustomerType) => {
    setCustomerType(newCustomerType);
    setInputs({
      districts: newCustomerType === "oldCustomer" ? "" : "Ba Đình", // Use the new value here
    });
  };

  const handleOldCustomerChange = (customer) => {
    setInputs(customer);
    onInputsChange(customer);
  };

  const customerTypeOptions = [
    {
      value: "oldCustomer",
      label: "Khách quen",
    },
    {
      value: "newCustomer",
      label: "Khách mới",
    },
  ];

  const handleInputsChange = (e) => {
    const newInputs = {
      ...inputs,
      [e.target.name]: e.target.value,
    };
    setInputs(newInputs);
    onInputsChange(newInputs);
  };

  const handleDistrictChange = (value) => {
    const newDistrict = {
      ...inputs,
      districts: value,
    };
    setInputs(newDistrict);
    onInputsChange(newDistrict);
  };

  useEffect(() => {}, [customerType]);

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 20,
    },
  };

  return (
    <div className="createOrderPersonalInfoFormContainer">
      <div className="personalInfoFormTitle">
        <h3 style={{ marginRight: "20px" }}>
          <Person /> Người nhận
        </h3>
        <Select
          defaultValue="oldCustomer"
          style={{ width: 120 }}
          onChange={handleCustomerTypeChange}
          options={customerTypeOptions}
        />
      </div>
      {customerType === "newCustomer" ? (
        <Form {...formItemLayout} layout={"horizontal"} form={form}>
          <Row>
            <Col span={12}>
              <Form.Item label="Tên">
                <Input
                  placeholder="Trần Phi Long"
                  name="name"
                  onChange={handleInputsChange}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại">
                <Input
                  placeholder="0988759374"
                  name="phone"
                  onChange={handleInputsChange}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Địa chỉ">
                <Input
                  placeholder="256 Đội Cấn"
                  name="detailedAddress"
                  onChange={handleInputsChange}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quận">
                <Select
                  options={districtNames}
                  onChange={handleDistrictChange}
                  placeholder="Quận"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Email">
                <Input
                  placeholder="example@email.com"
                  name="email"
                  onChange={handleInputsChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        // <div>
        //   <div className="personalInfoFormInputWrapper">
        //     <span>
        //       Tên <b style={{ color: "red" }}>(*)</b> :
        //     </span>
        //     <TextField
        //       label="Tên"
        //       placeholder="Trần Phi Long"
        //       size="small"
        //       name="name"
        //       onChange={handleInputsChange}
        //     />
        //   </div>
        //   <div className="personalInfoFormInputWrapper">
        //     <span>
        //       Địa chỉ <b style={{ color: "red" }}>(*)</b> :
        //     </span>
        //     <TextField
        //       label="Địa chỉ"
        //       placeholder="256 Đội Cấn"
        //       size="small"
        //       name="detailedAddress"
        //       onChange={handleInputsChange}
        //     />
        //   </div>
        //   <div className="personalInfoFormInputWrapper">
        //     <span></span>
        //     <TextField
        //       select
        //       defaultValue="Ba Đình"
        //       helperText="Chọn quận"
        //       size="small"
        //       name="district"
        //       onChange={handleInputsChange}
        //     >
        //       {districts.map((option, index) => (
        //         <MenuItem key={index} value={option.district}>
        //           {option.district}
        //         </MenuItem>
        //       ))}
        //     </TextField>
        //   </div>
        //   <div className="personalInfoFormInputWrapper">
        //     <span>
        //       Số điện thoại <b style={{ color: "red" }}>(*)</b> :
        //     </span>
        //     <TextField
        //       label="Sđt"
        //       placeholder="0123456789"
        //       size="small"
        //       name="phone"
        //       onChange={handleInputsChange}
        //     />
        //   </div>
        //   <div className="personalInfoFormInputWrapper">
        //     <span>Email :</span>
        //     <TextField
        //       label="Email"
        //       placeholder="example@email.com"
        //       size="small"
        //       name="email"
        //       onChange={handleInputsChange}
        //     />
        //   </div>
        // </div>
        <OldCustomerTable onCustomerChange={handleOldCustomerChange} />
      )}
    </div>
  );
};
