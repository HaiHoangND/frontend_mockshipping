import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { publicRequest } from "../../requestMethods";

export const ProfitChart = () => {
  const [profitData, setProfitData] = useState([]);
  console.log(profitData);

  useEffect(() => {
    const getProfitData = async () => {
      try {
        const res = await publicRequest.get("/order/statisticYear?year=2023");
        setProfitData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProfitData(); // Fetch data when the component mounts
  }, []);

  // Create the chart data when profitData is available
  const profit = {
    labels: profitData.map((data) => data.month),
    datasets: [
      {
        label: "Profit", // Use 'label' instead of 'labels' for the dataset label
        data: profitData.map((data) => data.profit),
      },
    ],
  };
  return <Line data={profit} />;
};
