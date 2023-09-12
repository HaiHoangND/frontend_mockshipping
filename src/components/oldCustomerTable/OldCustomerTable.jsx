import React, { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";

export const OldCustomerTable = ({ onCustomerChange }) => {
  const authUser = useAuthUser();
  const [oldCustomers, setOldCustomers] = useState([]);
  const [customerIndex, setCustomerIndex] = useState(-1);

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

  const handleChooseCustomer = (index, customer) => {
    setCustomerIndex(index);
    onCustomerChange({
      id: customer.id,
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
    });
  };

  return (
    <div className="mt-6">
      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th style={{ textAlign: "center" }}>Chọn</th>
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
            oldCustomers.map((customer, index) => (
              <tr
                key={customer.id}
                style={{
                  background: customerIndex === index ? "#7ceaaf" : "",
                }}
                onClick={() => handleChooseCustomer(index, customer)}
              >
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td style={{ textAlign: "center" }}>
                  <div>
                    <button>
                      {customerIndex === index ? (
                        <RadioButtonChecked />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
