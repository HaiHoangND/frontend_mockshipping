import { styled } from "styled-components";
import "./shippersTable.scss";
import { UpdateEmployeeInfoModal } from "../updateEmployeeInfoModal/UpdateEmployeeInfoModal";

const ShipperStatus = styled.span`
  padding: 10px 15px;
  background-color: ${(props) => (props.value === 0 ? "#14ae5c" : "#ffcd29")};
  border-radius: 10px;
  color: white;
`;

export const ShippersTable = ({ shipperData }) => {
  console.log(shipperData);
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
        {shipperData.map((shipper) => (
          <tr key={shipper.user.id}>
            <td style={{ paddingLeft: "100px" }}>{shipper.user.id}</td>
            <td>{shipper.user.fullName}</td>
            <td>{shipper.user.phone}</td>
            <td style={{ textAlign: "center" }}>{shipper.ordersInProgress}</td>
            <td style={{ textAlign: "center" }}>
              <ShipperStatus value={shipper.ordersInProgress}>
                {shipper.ordersInProgress === 0
                  ? "Đang rảnh"
                  : "Đang giao hàng"}
              </ShipperStatus>
            </td>
            <td>
              <UpdateEmployeeInfoModal employeeInfo={shipper} type={"update"} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
