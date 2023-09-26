import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { SentimentVeryDissatisfied } from "@mui/icons-material";

export const TopShopTable = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const shopOrders = shops.map((shop) => shop.numberOfOrders);
  // const shopOrdersSum = shopOrders.reduce((accumulator, currentValue) => {
  //   return accumulator + currentValue;
  // });

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
  return (
    <>
      {/* {shopOrdersSum !== 0 ? ( */}


        <Table columns={columns} dataSource={shops} pagination={false} />


      {/* ) : (
        <div className="flex flex-col items-center">
          <SentimentVeryDissatisfied
            fontSize="inherit"
            style={{ fontSize: "50px" }}
          />
          <span style={{ fontSize: "20px", marginTop: "10px" }}>
            Không có đơn hàng nào
          </span>
        </div>
      )} */}
      
    </>
  );
};
