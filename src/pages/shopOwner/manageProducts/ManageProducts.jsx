import {
    AddShoppingCartOutlined,
    ReceiptLong,
    SummarizeOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { CreateOrderProductTable } from "../../../components/createOrderProductTable/CreateOrderProductTable";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { Topbar } from "../../../components/topbar/Topbar";
import { publicRequest } from "../../../requestMethods";
import {
    convertCurrency,
    generateOrderCode,
} from "../../../utils/formatStrings";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { Searchbar } from "../../../components/searchbar/Searchbar";
import { ProductsListTableAnt } from "./ProductsListTableAnt";

import "./ManageProducts.scss";

const ManageProducts = () => {
    const navigate = useNavigate();
    const authUser = useAuthUser();
    const [isValid, setIsValid] = useState(false);
    const [productWeight, setProductWeight] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const [products, setProducts] = useState([]);
    const [currentShop, setCurrentShop] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchQueryChange = (newQuery) => {
        setSearchQuery(newQuery);
    };

    const handleProductWeightChange = (newWeight) => {
        setProductWeight(newWeight);
    };
    const handleProductPriceChange = (newPrice) => {
        setProductPrice(newPrice);
    };

    const handleProductChange = (newProducts) => {
        setProducts(newProducts);
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

    const handleManageProducts = async () => {
        try {
            if (!isValid) {
                return useToastError("Thông tin sản phẩm chưa hợp lệ!");
            } else {
                // Create products
                for (const product of products) {
                    await publicRequest.post("/product", {
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        image: product.image,
                        weight: product.weight,
                        description: product.description,
                        shippingOrderId: shippingOrder.data.data.id,
                    });
                }

                useToastSuccess("Thêm sản phẩm thành công");
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (products.length === 0) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [products]);

    return (
        <div className="bodyContainer">
            <Sidebar />
            <div className="contentContainer">
                <Topbar />
                <div className="manageProductsProductTableContainer">
                    <h3>
                        <ReceiptLong fontSize="inherit" /> Thêm sản phẩm
                    </h3>
                    <CreateOrderProductTable
                        onProductWeightChange={handleProductWeightChange}
                        onProductPriceChange={handleProductPriceChange}
                        onProductChange={handleProductChange}
                        addNewProducts={handleManageProducts}
                    />
                </div>
                <div className="productsTableContainer">
                    <div className="titleWrapper">
                        <h3>
                            <ReceiptLong fontSize="inherit" /> Danh sách đơn hàng
                        </h3>
                        <Searchbar onInputChange={handleSearchQueryChange} placeholderText={"Mã vận đơn"} />
                    </div>
                    <ProductsListTableAnt />
                </div>
            </div>

        </div>
    );
};

export default ManageProducts;
