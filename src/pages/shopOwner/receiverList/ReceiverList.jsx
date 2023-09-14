import React, { useEffect, useState } from "react";
import "./receiverList.scss";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { PeopleAlt } from "@mui/icons-material";
import { publicRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { Table } from "antd";
import { Searchbar } from "../../../components/searchbar/Searchbar";

const ReceiverList = () => {
  const [receivers, setReceivers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const authUser = useAuthUser();
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const getReceivers = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await publicRequest.get(
        `/receiver/getByShopOwnerId?shopOwnerId=${
          authUser().id
        }&pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      setReceivers(res.data.data.content);
      setTotalCount(res.data.data.totalElements);
      setPage(currentPage);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReceivers(1);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "receiver",
      render: (text) => text.id,
    },
    {
      title: "Họ và tên",
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
      title: "Đơn đã đặt",
      dataIndex: "numberOfOrders",
    },
    {
      title: "Đơn thành công",
      dataIndex: "successfulOrders",
    },
  ];
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="receiverListContainer">
          <div className="">
            <h3>
              <PeopleAlt /> Danh sách khách hàng
            </h3>
            <Searchbar onInputChange={handleSearchQueryChange} placeholderText={"Tìm kiếm khách hàng"}/>
          </div>
          <Table
            className="mt-5"
            columns={columns}
            dataSource={receivers}
            loading={isLoading}
            rowKey={(record) => record.receiver.id}
            pagination={{
              pageSize: pageSize,
              current: page,
              total: totalCount,
              onChange: (page) => {
                getReceivers(page);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiverList;
