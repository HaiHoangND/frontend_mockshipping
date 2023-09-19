import React, { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../../requestMethods";

export const WarehouseListTable = () => {
  const [warehouses, setWarehouses] = useState([]);

  const getWarehouses = async () => {
    try {
      const res = await userRequest.get("/user/statisticAllWarehouses");
      setWarehouses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWarehouses();
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th>Mã kho</th>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>Tổng đơn</th>
          <th>Đang giao</th>
          <th>Nhân viên</th>
        </tr>
      </thead>
      <tbody>
        {
          warehouses.map((warehouse) => (
            <tr key={warehouse.warehouse.id}>
              <td>{warehouse.warehouse.id}</td>
              <td>{warehouse.warehouse.name}</td>
              <td>{warehouse.warehouse.address}</td>
              <td>{warehouse.shippingOrders}</td>
              <td>{warehouse.delivering}</td>
              <td>{warehouse.shippers}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};
