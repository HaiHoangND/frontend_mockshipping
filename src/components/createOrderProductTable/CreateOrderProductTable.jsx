import { useState } from "react";
import "./createOrderProductTable.scss";
import * as XLSX from "xlsx";
import { convertCurrency } from "../../utils/formatStrings";

export const CreateOrderProductTable = () => {
  const [products, setProducts] = useState([]);
  console.log(products);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setProducts(parsedData);
    };
  };
  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên mặt hàng</th>
            <th>Số lượng</th>
            <th>Cân nặng</th>
            <th>Đơn giá</th>
            <th>Mô tả sản phẩm</th>
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
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
