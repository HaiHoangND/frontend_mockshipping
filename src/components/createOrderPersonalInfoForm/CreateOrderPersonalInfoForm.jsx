import { Person, Phone } from "@mui/icons-material";
import "./createOrderPersonalInfoForm.scss";
import { MenuItem, TextField } from "@mui/material";
import { districts } from "../../utils/shortestPath";
import { useState } from "react";
import { OldCustomerTable } from "../oldCustomerTable/OldCustomerTable";

export const CreateOrderPersonalInfoForm = ({ person, onInputsChange }) => {
  const [inputs, setInputs] = useState({
    districts: "Ba Đình",
  });
  const [customerType, setCustomerType] = useState("newCustomer");

  const handleCustomerTypeChange = (e) => {
    setCustomerType(e.target.value);
  };

  const customerTypeOptions = [
    {
      label: "Khách quen",
      value: "oldCustomer",
    },
    {
      label: "Khách mới",
      value: "newCustomer",
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

  return (
    <div className="createOrderPersonalInfoFormContainer">
      <div className="personalInfoFormTitle">
        <span style={{ marginRight: "20px" }}>
          <Person /> {person}
        </span>
        <TextField
          select
          label="Select"
          defaultValue="newCustomer"
          onChange={handleCustomerTypeChange}
          sx={{ width: "200px" }}
        >
          {customerTypeOptions.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {customerType === "newCustomer" ? (
        <div>
          <div className="personalInfoFormInputWrapper">
            <span>
              Tên <b style={{ color: "red" }}>(*)</b> :
            </span>
            <TextField
              label="Tên"
              placeholder="Trần Phi Long"
              size="small"
              name="name"
              onChange={handleInputsChange}
            />
          </div>
          <div className="personalInfoFormInputWrapper">
            <span>
              Địa chỉ <b style={{ color: "red" }}>(*)</b> :
            </span>
            <TextField
              label="Địa chỉ"
              placeholder="256 Đội Cấn"
              size="small"
              name="detailedAddress"
              onChange={handleInputsChange}
            />
          </div>
          <div className="personalInfoFormInputWrapper">
            <span></span>
            <TextField
              select
              defaultValue="Ba Đình"
              helperText="Chọn quận"
              size="small"
              name="district"
              onChange={handleInputsChange}
            >
              {districts.map((option, index) => (
                <MenuItem key={index} value={option.district}>
                  {option.district}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="personalInfoFormInputWrapper">
            <span>
              Số điện thoại <b style={{ color: "red" }}>(*)</b> :
            </span>
            <TextField
              label="Sđt"
              placeholder="0123456789"
              size="small"
              name="phone"
              onChange={handleInputsChange}
            />
          </div>
          <div className="personalInfoFormInputWrapper">
            <span>Email :</span>
            <TextField
              label="Email"
              placeholder="example@email.com"
              size="small"
              name="email"
              onChange={handleInputsChange}
            />
          </div>
        </div>
      ) : (
        <OldCustomerTable />
      )}
    </div>
  );
};
