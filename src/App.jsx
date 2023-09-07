import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CoordinatorDashboard from "./pages/coordinator/coordinatorDashboard/CoordinatorDashboard";
import CreateOrder from "./pages/coordinator/createOrder/CreateOrder";
import Login from "./pages/login/login";
import ShipperAllOrders from "./pages/shipper/shippingOrder/ShipperAllOrders";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import CoordinatorShipperList from "./pages/coordinator/coordinatorShipperList/CoordinatorShipperList";
import ShipperOrderDetail from "./pages/shipper/orderDetail/ShipperOrderDetail";

import AdminDashboard from "./pages/admin/adminDashboard/AdminDashboard";

import OrderDetail from "./pages/common/orderDetail/OrderDetail";
import WarehouseList from "./pages/admin/warehouseList/WarehouseList";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  const authUser = useAuthUser();
  const role = authUser()?.role;

  const CoordinatorRoute = ({ Component }) => {
    return role === "COORDINATOR" ? <Component /> : <Navigate to="/login" />;
  };

  const ShipperRoute = ({ Component }) => {
    return role === "SHIPPER" ? <Component /> : <Navigate to="/login" />;
  };

  const AdminRoute = ({ Component }) => {
    return role === "ADMIN" ? <Component /> : <Navigate to="/login" />;
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
        <Route path="/shipper" element={<ShipperAllOrders />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/coordinator"
          element={<CoordinatorRoute Component={CoordinatorDashboard} />}
        />
        <Route
          path="/coordinator/createOrder"
          element={<CoordinatorRoute Component={CreateOrder} />}
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

        <Route path="/orderDetail/:orderCode" element={<OrderDetail />} />
        <Route path="/shipper/orderDetail/:orderCode" element={<ShipperOrderDetail />} />

      </Routes>
    </HashRouter>
  );
}

export default App;
