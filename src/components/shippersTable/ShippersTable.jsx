import { styled } from "styled-components";
import "./shippersTable.scss";
import { UpdateEmployeeInfoModal } from "../updateEmployeeInfoModal/UpdateEmployeeInfoModal";
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../../requestMethods";

export const ShippersTable = ({ searchQuery }) => {
  const [shippers, setShippers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(true);

  const getShippers = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await userRequest.get(
        `/user/getAllShippers?pageNumber=${currentPage}&pageSize=${pageSize}&keyWord=${searchQuery}`
      );
      setShippers(res.data.data.content);
      setTotalCount(res.data.data.totalElements);
      setPage(currentPage);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShippers(1);
  }, [searchQuery]);

  const columns = [
    {
      title: "ID",
      dataIndex: "user",
      render: (user) => <span>{user.id}</span>,
    },
    {
      title: "Tên",
      dataIndex: "user",
      render: (user) => <span>{user.fullName}</span>,
    },
    {
      title: "Email",
      dataIndex: "user",
      render: (user) => <span>{user.email}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "user",
      render: (user) => <span>{user.phone}</span>,
    },
    {
      title: "Đơn hàng",
      dataIndex: "ordersInProgress",
      align: "center",
      sorter: {
        compare: (a, b) => a.ordersInProgress - b.ordersInProgress,
      },
    },
    {
      title: "Trạng thái nhân viên",
      dataIndex: "user",
      align: "center",
      render: (user) => {
        let workingStatus = user.workingStatus;
        let tagColor;
        switch (workingStatus) {
          case false:
            tagColor = "volcano";
            break;
          case true:
            tagColor = "green";
            break;
        }

        return (
          <Tag color={tagColor}>
            {workingStatus === true ? "Đang làm việc" : "Nghỉ việc"}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật thông tin",
      align: "center",
      render: (_, record) => (
        <UpdateEmployeeInfoModal type={"update"} employeeInfo={record} />
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={shippers}
      rowKey={(record) => record.user.id}
      loading={isLoading}
      pagination={{
        pageSize: pageSize,
        current: page,
        total: totalCount,
        onChange: (page) => {
          getShippers(page);
        },
      }}
    />
  );
};
