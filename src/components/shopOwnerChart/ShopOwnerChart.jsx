import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { publicRequest, userRequest } from "../../requestMethods";

export const ShopOwnerChart = ({ month, year, onProfitDataChange }) => {
  const [profitData, setProfitData] = useState([]);
  const authUser = useAuthUser();
  useEffect(() => {
    const getProfitData = async () => {
      try {
        const res = await userRequest.get(
          `/order/statisticMonthForShop?month=${month}&year=${year}&shopOwnerId=${authUser().id
          }`
        );
        setProfitData(res.data.data);
        onProfitDataChange(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProfitData(); // Fetch data when the component mounts
  }, [month, year]);

  // Create the chart data when profitData is available
  const profit = {
    labels: profitData.map((data) => data.date),
    datasets: [
      {
        label: "Profit", // Use 'label' instead of 'labels' for the dataset label
        data: profitData.map((data) => data.profit),
      },
    ],
  };
  return (
    <Line
      data={profit}
      options={{
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  );
};
