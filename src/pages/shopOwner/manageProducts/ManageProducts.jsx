import { ReceiptLong } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest, userRequest } from "../../../requestMethods";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { ProductsListTableAnt } from "./ProductsListTableAnt";

import "./ManageProducts.scss";
import { Button } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { convertCurrency } from "../../../utils/formatStrings";

const labels = [
  { title: "Tên sản phẩm", dataIndex: "name" },
  { title: "Mã sản phẩm", dataIndex: "productCode" },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
    render: (value) => convertCurrency(value),
  },
  {
    title: "Cân nặng",
    dataIndex: "weight",
    render: (value) => `${value} kg`,
  },
  {
    title: "Mô tả sản phẩm",
    dataIndex: "description",
  },
  {
    title: "Tình trạng",
    dataIndex: "quantity",
    render: (quantity) => {
      let status;
      if (quantity > 5) {
        status = "Còn hàng";
      } else if (quantity <= 5 && quantity > 0) {
        status = "Sắp hết hàng";
      } else if (quantity === 0) {
        status = "Hết hàng";
      } else {
        status = "Không rõ tình trạng";
      }
      return status;
    },
  },
];

const ManageProducts = () => {
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const [currentShop, setCurrentShop] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const getCurrentShop = async () => {
    try {
      const res = await userRequest.get(`/user/${authUser().id}`);
      setCurrentShop(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentShop();
  }, []);

  const handleExport = async () => {
    try {
      const res = await userRequest.get(
        `/productShop/getByShopOwnerIdNoPage?ShopOwnerId=${authUser().id}`
      );
      new Excel()
        .addSheet("Danh sách sản phẩm")
        .addColumns(labels)
        .addDataSource(res.data.data)
        .saveAs("Danh sách sản phẩm.xlsx");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="contentContainer">
        <Topbar />

        <div className="manageProductsProductTableContainer">
          <h3>
            <ReceiptLong fontSize="inherit" /> Thêm sản phẩm
          </h3>
          <CreateOrderProductTable />
        </div>
        <div className="productsTableContainer">
          <div className="titleWrapper mb-7">
            <div className="flex items-center gap-5">
              <h3 style={{ marginBottom: "0px" }}>
                <ReceiptLong fontSize="inherit" /> Sản phẩm trong kho
              </h3>
              <Button
                onClick={handleExport}
                ghost
                type="primary"
                icon={<CloudDownloadOutlined />}
              >
                Xuất ra file .xlsx
              </Button>
            </div>
            <Searchbar
              onInputChange={handleSearchQueryChange}
              placeholderText={"Tìm kiếm sản phẩm"}
            />
          </div>
          <ProductsListTableAnt searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
