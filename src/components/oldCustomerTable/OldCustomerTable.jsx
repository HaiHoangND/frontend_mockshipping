import { Divider, Radio, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { publicRequest } from "../../requestMethods";

export const OldCustomerTable = ({ onCustomerChange }) => {
  const authUser = useAuthUser();
  const [oldCustomers, setOldCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getOldCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await publicRequest.get(`/user/${authUser().id}`);
      setOldCustomers(res.data.data.receiverList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOldCustomers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const customer = selectedRows[0];
      onCustomerChange({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
      });
    },
  };
  return (
    <div>
      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={oldCustomers}
        rowKey={(record) => record.id}
      />
    </div>
  );
};
