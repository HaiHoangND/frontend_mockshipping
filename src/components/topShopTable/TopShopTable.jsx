import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export const TopShopTable = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getShopsData = async () => {
    try {
      setIsLoading(true);
      const res = await userRequest.get(
        "/user/getTop7ShopOwnerHaveMostShippingOrder"
      );
      setShops(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShopsData();
  }, []);

  const columns = [
    {
      title: "Tên chủ shop",
      dataIndex: "shopOwner",
      width: 200,
      render: (owner) => owner.fullName,
    },
    {
      title: "Email",
      dataIndex: "shopOwner",
      render: (owner) => owner.email,
    },
    {
      title: "Số đơn hàng",
      dataIndex: "numberOfShippingOrders",
      align: "center",
    },
  ];
  return <Table columns={columns} dataSource={shops} pagination={false} />;
};
