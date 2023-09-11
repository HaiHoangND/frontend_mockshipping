import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import { useAuthUser } from "react-auth-kit";

export const OldCustomerTable = () => {
  const authUser = useAuthUser();
  const [oldCustomers, setOldCustomers] = useState([]);

  const getOldCustomers = async () => {
    try {
      const res = await publicRequest.get(`/user/${authUser().id}`);
      setOldCustomers(res.data.data.receiverList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOldCustomers();
  }, []);

  console.log(oldCustomers);
  return (
    <div className="mt-6">
      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {oldCustomers.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center">
                Không có khách hàng nào
              </td>
            </tr>
          ) : (
            oldCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
