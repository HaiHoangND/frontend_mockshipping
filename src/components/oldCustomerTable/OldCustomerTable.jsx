import { Divider, Radio, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { publicRequest } from "../../requestMethods";

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

  const columns = [
    {
      title: "Mã số khách hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };
console.log(oldCustomers);
  return (
    <div>
      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={oldCustomers}
      />
    </div>
  );
};
