import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { publicRequest, userRequest } from "../../requestMethods";
import { SentimentVeryDissatisfied } from "@mui/icons-material";

export const AdminPieChart = ({ day, month, year }) => {
  const [orderData, setOrderData] = useState([]);
  const orderQuantity = orderData.map((data) => data.quantity);
  const orderSum = orderQuantity.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  useEffect(() => {
    const getOrderData = async () => {
      try {
        const res = await userRequest.get(
          `http://localhost:8080/api/order/pieChartStatistic?day=${day}&month=${month}&year=${year}`
        );
        setOrderData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderData();
  }, [day, month, year]);

  const order = {
    labels: ["Tạo đơn", "Đang giao", "Giao thành công", "Đơn hủy"],
    datasets: [
      {
        labels: "Tỉ lệ đơn",
        data: orderQuantity,
        backgroundColor: ["#36A2EB", "#FFC300", "green", "#FF5733"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div className="flex items-center">
      {orderSum === 0 ? (
        <div className="flex flex-col items-center" >
          <SentimentVeryDissatisfied fontSize="inherit" style={{fontSize:"50px"}}/>
          <span style={{fontSize:"20px", marginTop:"10px"}}>Không có đơn hàng nào</span>
        </div>
      ) : (
        <Pie data={order} options={options} />
      )}
    </div>
  );
};
