import { styled } from "styled-components";
import "./shippersTable.scss";
import { UpdateEmployeeInfoModal } from "../updateEmployeeInfoModal/UpdateEmployeeInfoModal";
import { Table, Tag } from "antd";

export const ShippersTable = ({ shipperData }) => {
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
      title: "Số điện thoại",
      dataIndex: "user",
      render: (user) => <span>{user.phone}</span>,
    },
    {
      title: "Đơn hàng",
      dataIndex: "ordersInProgress",
      align:"center"
    },
    {
      title: "Trạng thái nhân viên",
      dataIndex: "user",
      align:"center",
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
      dataSource={shipperData}
      rowKey={(record) => record.user.id}
    />
  );
};
