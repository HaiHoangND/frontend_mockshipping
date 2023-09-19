import { ReceiptLong } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest } from "../../../requestMethods";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { ProductsListTableAnt } from "./ProductsListTableAnt";

import "./ManageProducts.scss";

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
      const res = await publicRequest.get(`/user/${authUser().id}`);
      setCurrentShop(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentShop();
  }, []);

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
          <div className="titleWrapper">
            <h3>
              <ReceiptLong fontSize="inherit" /> Sản phẩm trong kho
            </h3>
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
