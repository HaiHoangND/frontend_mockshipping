import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CoordinatorDashboard from "./pages/coordinator/coordinatorDashboard/CoordinatorDashboard";
import CreateOrder from "./pages/coordinator/createOrder/CreateOrder";
import Login from "./pages/login/login";
import ShipperAllOrders from "./pages/shipper/shippingOrder/ShipperAllOrders";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";

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
        <Route exact path="/" element={<CoordinatorRoute Component={CoordinatorDashboard} />} />
        <Route path="/shipper" element={<ShipperAllOrders />} />
        <Route path="/shipper/shipping" element={<ShipperAllOrders />} />
        <Route path="/shipper/success" element={<ShipperAllOrders />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/coordinator"
          element={<CoordinatorRoute Component={CoordinatorDashboard} />}
        />
        <Route
          path="/coordinator/createOrder"
          element={<CoordinatorRoute Component={CreateOrder} />}
        />
        {/* <Route path='/shipper' element={<ShipperAllOrders />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
