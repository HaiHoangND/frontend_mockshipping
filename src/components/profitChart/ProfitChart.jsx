import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { publicRequest, userRequest } from "../../requestMethods";

export const ProfitChart = ({ month, year }) => {
  const [profitData, setProfitData] = useState([]);
  useEffect(() => {
    const getProfitData = async () => {
      try {
        const res = await userRequest.get(
          `/order/statisticMonthForAdmin?month=${month}&year=${year}`
        );
        setProfitData(res.data.data);
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
        label: "Doanh thu", // Use 'label' instead of 'labels' for the dataset label
        data: profitData.map((data) => data.profit),
        pointRadius: 0,
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
            beginAtZero: true,
          },
        },
      }}
    />
  );
};
