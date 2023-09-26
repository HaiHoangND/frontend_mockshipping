import { Person } from "@mui/icons-material";
import "./orderDetailPersonalInfo.scss";

export const OrderDetailPersonalInfo = ({ person, type }) => {
  return (
    <div className="orderDetailPersonalInfoContainer">
      <div className="orderDetailPersonalInfoFormTitle">
        <Person /> {type}
      </div>
      <div className="orderDetailPersonalInfoItem">
        <span>Tên:</span>
        <span>{type === "Người gửi" ? person.fullName : person.name}</span>
      </div>
      <div className="orderDetailPersonalInfoItem">
        <span>Địa chỉ:</span>
        <span>{person.address}</span>
      </div>
      <div className="orderDetailPersonalInfoItem">
        <span>Số điện thoại:</span>
        <span>{person.phone}</span>
      </div>
    </div>
  );
};
