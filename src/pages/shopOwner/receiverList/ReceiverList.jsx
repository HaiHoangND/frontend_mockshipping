import React, { useEffect, useState } from "react";
import "./receiverList.scss";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { PeopleAlt } from "@mui/icons-material";
import { publicRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { Table } from "antd";

const ReceiverList = () => {
  const [receivers, setReceivers] = useState([]);
  const [page, setPage] = useState(1);
  const authUser = useAuthUser();
  const [isLoading, setIsLoading] = useState(true);

  const getReceivers = async () => {
    try {
      const res = await publicRequest.get(`/user/${authUser().id}`);
      setReceivers(res.data.data.receiverList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReceivers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Họ và tên",
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
    {
      title: "Đơn đã đặt",
    },
    {
      title: "Đơn thành công",
    },
  ];
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="receiverListContainer">
          <div className="titleWrapper">
            <h3>
              <PeopleAlt /> Danh sách khách hàng
            </h3>
          </div>
          <Table columns={columns} dataSource={receivers} className="mt-5"/>
        </div>
      </div>
    </div>
  );
};

export default ReceiverList;
