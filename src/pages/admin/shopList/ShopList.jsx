import React, { useEffect, useState } from "react";
import "./shopList.scss";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { ShoppingCart } from "@mui/icons-material";
import { publicRequest } from "../../../requestMethods";
import { Table } from "antd";
import { Searchbar } from "../../../components/searchbar/Searchbar";

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };



  const getShops = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await publicRequest.get(
        `/user/getAllShopOwners?pageNumber=${currentPage}&pageSize=${pageSize}&keyWord=${searchQuery}`
      );
      setShops(res.data.data.content);
      setTotalCount(res.data.data.totalElements);
      setPage(currentPage);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(shops);

  useEffect(() => {
    getShops(1);
  }, [searchQuery]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên chủ shop",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
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
      title: "Số lượng khách hàng",
      dataIndex: "receiverList",
      render: (list) => list?.length,
      align: "center",
    },
    // {
    //   title: "Sản phẩm trong kho",
    //   dataIndex: "productShops",
    //   render: (list) => list?.length,
    //   align: "center",
    // },
  ];

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />
        <div className="shopListContainer">
          <div className="titleWrapper flex justify-between">
            <h3>
              <ShoppingCart fontSize="inherit" />
              Danh sách các shop
            </h3>
            <Searchbar
              placeholderText={"Tìm kiếm chủ shop"}
              onInputChange={handleSearchQueryChange}
            />
          </div>
          <Table
            className="mt-5"
            columns={columns}
            dataSource={shops}
            loading={isLoading}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              current: page,
              total: totalCount,
              onChange: (page) => {
                getShops(page);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopList;
