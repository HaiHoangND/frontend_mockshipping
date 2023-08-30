import { Person, Phone } from "@mui/icons-material";
import "./createOrderPersonalInfoForm.scss";
import { MenuItem, TextField } from "@mui/material";

export const CreateOrderPersonalInfoForm = ({ person }) => {
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
        />
      </div>
      <div className="personalInfoFormInputWrapper">
      <span>
         Số điện thoại <b style={{ color: "red" }}>(*)</b> :
        </span>
        <TextField
          label="Sđt"
          placeholder="0123456789"
          size="small"
        />
      </div>
      <div className="personalInfoFormInputWrapper">
      <span>
         Email :
        </span>
        <TextField
          label="Email"
          placeholder="example@email.com"
          size="small"
        />
      </div>
    </div>
  );
};
