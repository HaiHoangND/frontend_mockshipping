import { styled } from "styled-components";
import "./shippersTable.scss";
import { UpdateEmployeeInfoModal } from "../updateEmployeeInfoModal/UpdateEmployeeInfoModal";

const ShipperStatus = styled.div`
  padding: 10px 15px;
  width: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.name === "Đang rảnh"
      ? "#14ae5c"
      : props.name === "Đang giao hàng"
      ? "#ffcd29"
      : props.name === "Nghỉ việc"
      ? "#f24822"
      : "gray"};
  border-radius: 10px;
  color: white;
`;

export const ShippersTable = ({ shipperData }) => {
  const getStatus = (shipperData) => {
    if (!shipperData.user.workingStatus) {
      return "Nghỉ việc";
    } else if (shipperData.ordersInProgress === 0) {
      return "Đang rảnh";
    } else {
      return "Đang giao hàng";
    }
  };
  return (
    <table>
      <thead>
        <tr>
          <th> Mã số nhân viên</th>
          <th>Tên</th>
          <th>Số điện thoại</th>
          <th style={{ textAlign: "center" }}>Số lượng đơn hàng</th>
          <th style={{ textAlign: "center" }}>Trạng thái nhân viên</th>
          <th style={{ textAlign: "center" }}>Cập nhật thông tin</th>
        </tr>
      </thead>
      <tbody>
        {
        shipperData.length !== 0 ?
        shipperData.map((shipper) => (
          <tr key={shipper.user.id}>
            <td style={{ paddingLeft: "100px" }}>{shipper.user.id}</td>
            <td>{shipper.user.fullName}</td>
            <td>{shipper.user.phone}</td>
            <td style={{ textAlign: "center" }}>{shipper.ordersInProgress}</td>
            <td className="flex justify-center">
              <ShipperStatus name={getStatus(shipper)}>
                {getStatus(shipper)}
              </ShipperStatus>
            </td>
            <td>
              <UpdateEmployeeInfoModal employeeInfo={shipper} type={"update"} />
            </td>
          </tr>
        )) : (
          <tr><td colSpan={6} className="text-center">Không tìm thấy nhân viên nào</td></tr>
        )}
      </tbody>
    </table>
  );
};
