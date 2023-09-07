import { convertCurrency } from "../../utils/formatStrings";
import "./orderDetailProductTable.scss";

export const OrderDetailProductTable = ({ products }) => {
  return (
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
        {products.map((product, index) => (
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
  );
};
