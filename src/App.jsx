import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/adminDashboard/AdminDashboard";
import CoordinatorDashboard from "./pages/coordinator/coordinatorDashboard/CoordinatorDashboard";
import CoordinatorShipperList from "./pages/coordinator/coordinatorShipperList/CoordinatorShipperList";
import Login from "./pages/login/login";
import ShipperOrderDetail from "./pages/shipper/orderDetail/ShipperOrderDetail";
import ShipperAllOrders from "./pages/shipper/shippingOrder/ShipperAllOrders";
import CreateOrder from "./pages/shopOwner/createOrder/CreateOrder";

import ShopList from "./pages/admin/shopList/ShopList";
import OrderDetail from "./pages/common/orderDetail/OrderDetail";
import Register from "./pages/common/register/Register";
import ReceiverList from "./pages/shopOwner/receiverList/ReceiverList";
import ShopOwnerDashboard from "./pages/shopOwner/shopOwnerDashboard/ShopOwnerDashboard";


function App() {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  const authUser = useAuthUser();
  const role = authUser()?.role;

  const CommonRoute = ({ Component }) => {
    return auth ? <Component /> : <Navigate to="/login" />;
  };

  const CoordinatorRoute = ({ Component }) => {
    return role === "COORDINATOR" || role === "ADMIN" ? (
      <Component />
    ) : (
      <Navigate to="/login" />
    );
  };

  const ShipperRoute = ({ Component }) => {
    return role === "SHIPPER" || role === "ADMIN" ? (
      <Component />
    ) : (
      <Navigate to="/login" />
    );
  };

  const AdminRoute = ({ Component }) => {
    return role === "ADMIN" ? <Component /> : <Navigate to="/login" />;
  };

  const ShopRoute = ({ Component }) => {
    return role === "SHOP" || role === "ADMIN" ? (
      <Component />
    ) : (
      <Navigate to="/login" />
    );
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
          path="/admin/shops"
          element={<AdminRoute Component={ShopList} />}
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
        <Route
          path="/shop/clients"
          element={<ShopRoute Component={ReceiverList} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
