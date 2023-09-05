import { Person, Phone } from "@mui/icons-material";
import "./createOrderPersonalInfoForm.scss";
import { MenuItem, TextField } from "@mui/material";
import { districts } from "../../utils/shortestPath";
import { useState } from "react";

export const CreateOrderPersonalInfoForm = ({ person, onInputsChange }) => {
  const [inputs, setInputs] = useState({});

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
        <Person /> {person}
      </div>
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
          defaultValue="Ba Dinh"
          helperText="Chọn quận"
          size="small"
          name="district"
          onChange={handleInputsChange}
        >
          {districts.map((option) => (
            <MenuItem key={option.id} value={option.district}>
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
  );
};
