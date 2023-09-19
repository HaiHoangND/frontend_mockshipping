import { Divider, Radio, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { publicRequest, userRequest } from "../../requestMethods";
import { UpdateReceiverModal } from "../updateReceiverModal/UpdateReceiverModal";

export const OldCustomerTable = ({ onCustomerChange, searchQuery }) => {
  const authUser = useAuthUser();
  const [oldCustomers, setOldCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const pageSize = 10;

  const getOldCustomers = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await userRequest.get(
        `/receiver/getByShopOwnerId?shopOwnerId=${authUser().id
        }&pageNumber=${currentPage}&pageSize=${pageSize}&keyWord=${searchQuery}`
      );
      setOldCustomers(res.data.data.content);
      setTotalCount(res.data.data.totalElements);
      setPage(currentPage);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOldCustomers(1);
  }, [searchQuery]);

  const columns = [
    {
      title: "ID",
      dataIndex: "receiver",
      render: (text) => text.id,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "receiver",
      render: (text) => text.name,
    },
    {
      title: "Số điện thoại",
      dataIndex: "receiver",
      render: (text) => text.phone,
    },
    {
      title: "Địa chỉ",
      dataIndex: "receiver",
      render: (text) => text.address,
    },
    {
      title: "Sửa",
      align: "center",
      render: (_, record) => <UpdateReceiverModal receiver={record.receiver} />,
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const customer = selectedRows[0];
      onCustomerChange({
        id: customer.receiver.id,
        name: customer.receiver.name,
        address: customer.receiver.address,
        phone: customer.receiver.phone,
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
        rowKey={(record) => record.receiver.id}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: totalCount,
          onChange: (page) => {
            getOldCustomers(page);
          },
        }}
      />
    </div>
  );
};
