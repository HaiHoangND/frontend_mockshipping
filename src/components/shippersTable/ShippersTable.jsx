import { styled } from "styled-components";
import "./shippersTable.scss";
import { UpdateEmployeeInfoModal } from "../updateEmployeeInfoModal/UpdateEmployeeInfoModal";
import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../../requestMethods";
import { RetweetOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useToastError } from "../../utils/toastSettings";
import { WarningModal } from "../warningModal/WarningModal";

const ResetPasswordBtn = () => {
  return <Button icon={<RetweetOutlined />} />;
};

export const ShippersTable = ({ searchQuery }) => {
  const [shippers, setShippers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleResetPassword = async (id) => {
    try {
      const res = await userRequest.put(
        `/user/updatePassword?id=${id}&password=12345678`
      );
      if (res.data.type === "success") {
        navigate(0);
      } else {
        useToastError("Có lỗi xảy ra");
      }
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
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <UpdateEmployeeInfoModal type={"update"} employeeInfo={record} />
            <WarningModal
              InitiateComponent={ResetPasswordBtn}
              confirmFunction={handleResetPassword}
              parameters={record.user.id}
              warningContent={
                "Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này?"
              }
            />
          </div>
        );
      },
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
