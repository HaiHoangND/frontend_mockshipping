import React, { useState } from "react";
import "./register.scss";
import { MenuItem, TextField } from "@mui/material";
import { districts } from "../../../utils/shortestPath";
import { publicRequest, userRequest } from "../../../requestMethods";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    gender: "Nam",
    district: "Ba Đình",
  });

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleRegister = async () => {
    const res = await userRequest.post("/register", {
      fullName: inputs.fullName,
      email: inputs.email,
      password: inputs.password,
      role: "SHOP",
      address: `${inputs.detailedAddress}, ${inputs.district}`,
      gender: inputs.gender,
      phone: inputs.phone,
      workingStatus: true,
    });
    if (res.data.type === "success") {
      useToastSuccess("Đăng kí thành công");
      navigate("/login");
    } else {
      return useToastError(res.data.message);
    }
  };

  return (
    <div className="registerBodyContainer">
      <div className="registerBodyWrapper">
        <div className="registerSapoLogoContainer">
          <img src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107" />
        </div>
        <h3>Đăng kí để bắt đầu tạo đơn</h3>
        <div className="registerInputsWrapper">
          <div className="registerInputWrapper">
            <TextField
              variant="outlined"
              label="Tên"
              name="fullName"
              onChange={handleInputsChange}
            />
          </div>
          <div className="registerInputWrapper">
            <TextField
              select
              defaultValue={"Nam"}
              variant="outlined"
              label="Giới tính"
              name="gender"
              onChange={handleInputsChange}
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
            </TextField>
          </div>
          <div className="registerInputWrapper">
            <TextField
              variant="outlined"
              label="Số điện thoại"
              name="phone"
              onChange={handleInputsChange}
            />
          </div>
          <div className="registerInputWrapper">
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              onChange={handleInputsChange}
            />
          </div>
          <div className="registerInputWrapper">
            <TextField
              variant="outlined"
              label="Địa chỉ"
              name="detailedAddress"
              onChange={handleInputsChange}
            />
          </div>
          <div className="registerInputWrapper">
            <TextField
              select
              defaultValue={districts[0].district}
              variant="outlined"
              label="Quận"
              name="district"
              onChange={handleInputsChange}
            >
              {districts.map((district, index) => (
                <MenuItem key={index} value={district.district}>
                  {district.district}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="registerInputWrapper col-span-2">
            <TextField
              variant="outlined"
              label="Mật khẩu"
              name="password"
              onChange={handleInputsChange}
              type="password"
            />
          </div>
        </div>
        <div className="registerBtn">
          <button onClick={handleRegister}>Đăng kí</button>
          <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
