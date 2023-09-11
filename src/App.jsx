import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CoordinatorDashboard from "./pages/coordinator/coordinatorDashboard/CoordinatorDashboard";
import Login from "./pages/login/login";
import ShipperAllOrders from "./pages/shipper/shippingOrder/ShipperAllOrders";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import CoordinatorShipperList from "./pages/coordinator/coordinatorShipperList/CoordinatorShipperList";
import ShipperOrderDetail from "./pages/shipper/orderDetail/ShipperOrderDetail";
import CreateOrder from "./pages/shopOwner/createOrder/CreateOrder";
import AdminDashboard from "./pages/admin/adminDashboard/AdminDashboard";

import OrderDetail from "./pages/common/orderDetail/OrderDetail";
import WarehouseList from "./pages/admin/warehouseList/WarehouseList";
import ShopOwnerDashboard from "./pages/shopOwner/shopOwnerDashboard/ShopOwnerDashboard";
import Register from "./pages/common/register/Register";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  const authUser = useAuthUser();
  const role = authUser()?.role;

  const CommonRoute = ({ Component }) => {
    return auth ? <Component /> : <Navigate to="/login" />;
  };

  const CoordinatorRoute = ({ Component }) => {
    return role === "COORDINATOR" ? <Component /> : <Navigate to="/login" />;
  };

  const ShipperRoute = ({ Component }) => {
    return role === "SHIPPER" ? <Component /> : <Navigate to="/login" />;
  };

  const AdminRoute = ({ Component }) => {
    return role === "ADMIN" ? <Component /> : <Navigate to="/login" />;
  };

  const ShopRoute = ({ Component }) => {
    return role === "SHOP" ? <Component /> : <Navigate to="/login" />;
  };

  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        <Route
          exact
          path="/"
          element={<CoordinatorRoute Component={CoordinatorDashboard} />}
        />
        <Route
          path="/shipper"
          element={<ShipperRoute Component={ShipperAllOrders} />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/coordinator"
          element={<CoordinatorRoute Component={CoordinatorDashboard} />}
        />
        <Route
          path="/shop/createOrder"
          element={<ShopRoute Component={CreateOrder} />}
        />
        <Route
          path="/coordinator/shipperList"
          element={<CoordinatorRoute Component={CoordinatorShipperList} />}
        />
        <Route
          path="/admin"
          element={<AdminRoute Component={AdminDashboard} />}
        />
        <Route
          path="/admin/warehouses"
          element={<AdminRoute Component={WarehouseList} />}
        />
        {/* <Route path='/shipper' element={<ShipperAllOrders />} /> */}

        <Route
          path="/shipper/shipperOrderDetail/:orderCode"
          element={<ShipperRoute Component={ShipperOrderDetail} />}
        />

        <Route
          path="/orderDetail/:orderCode"
          element={<CommonRoute Component={OrderDetail} />}
        />
        <Route
          path="/shipper/shipperOrderDetail/:orderCode"
          element={<ShipperRoute Component={ShipperOrderDetail} />}
        />
        <Route
          path="/shop"
          element={<ShopRoute Component={ShopOwnerDashboard} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
