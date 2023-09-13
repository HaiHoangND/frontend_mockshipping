import { useEffect, useRef, useState } from "react";
import "./createOrderProductTable.scss";
import * as XLSX from "xlsx";
import { convertCurrency } from "../../utils/formatStrings";
import { AddProductModal } from "../addProductModal/AddProductModal";
import { WarningModal } from "../warningModal/WarningModal";
import { Delete } from "@mui/icons-material";
import { removeItemByIndex } from "../../utils/getLastArrayItem";
import CustomizedMenus from "../../pages/shopOwner/manageProducts/CustomizedMenus";

const DeleteProductBtn = () => {
  return (
    <button className="deleteSingleProductBtn">
      <Delete />
    </button>
  );
};

const ClearProductsBtn = () => {
  return <button className="deleteAllProducts">Xóa tất cả sản phẩm</button>;
};

export const CreateOrderProductTable = ({
  onProductPriceChange,
  onProductWeightChange,
  onProductChange,
}) => {
  const [products, setProducts] = useState([]);
  const fileInputRef = useRef(null);

  const handleUploadExcel = () => {
    fileInputRef.current.click();
  };

  const handleClearProducts = () => {
    setProducts([]);
    onProductChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setProducts((prevProducts) => [...prevProducts, ...parsedData]);
      onProductChange((prevProducts) => [...prevProducts, ...parsedData]);
    };
  };

  const handleAddProduct = (inputs, imageURL) => {
    console.log(inputs, imageURL);
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
      },
    ]);

    onProductChange((prevProducts) => [
      ...prevProducts,
      {
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
      },
    ]);
  };
  useEffect(() => {
    let productWeight = 0;
    let productPrice = 0;
    for (const product of products) {
      if (product.weight && product.price) {
        productWeight = productWeight + product.weight * product.quantity;
        productPrice = productPrice + product.price * product.quantity;
      }
    }
    onProductWeightChange(productWeight);
    onProductPriceChange(productPrice);
  }, [products]);

  const handleDeleteSingleProduct = (index) => {
    const changedProductsArray = removeItemByIndex(products, index);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
    setProducts(changedProductsArray);
    onProductChange(changedProductsArray);
  };

  return (
    <div>
      <div className="uploadExcelBtn">
        <CustomizedMenus handleExelClick={handleUploadExcel} />
        <WarningModal
          InitiateComponent={ClearProductsBtn}
          warningContent={"Ban có chắc muốn xóa tát cả sản phẩm không?"}
          confirmFunction={handleClearProducts}
        />
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên mặt hàng</th>
            <th>Số lượng</th>
            <th>Cân nặng</th>
            <th>Đơn giá</th>
            <th>Mô tả sản phẩm</th>
            <th style={{ textAlign: "center" }}>Xóa sản phẩm</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 &&
            products.map((product, index) => (
              <tr key={index}>
                <td>
                  <div style={{ width: "100px" }}>
                    <img
                      src={product.image}
                      alt=""
                      style={{ maxWidth: "100%", objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.weight} KG</td>
                <td>{convertCurrency(product.price)}</td>
                <td>{product.description}</td>
                <td style={{ textAlign: "center" }}>
                  <WarningModal
                    InitiateComponent={DeleteProductBtn}
                    warningContent={"Bạn có chắc muốn xóa sản phẩm này chứ"}
                    confirmFunction={handleDeleteSingleProduct}
                    parameters={index}
                  />
                </td>
              </tr>
            ))}
          <tr>
            <td style={{ textAlign: "center" }} colSpan={7}>
              <AddProductModal handleAddProduct={handleAddProduct} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
