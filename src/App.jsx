import { HashRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CoordinatorDashboard from './pages/coordinator/coordinatorDashboard/CoordinatorDashboard';
import CreateOrder from './pages/coordinator/createOrder/CreateOrder';
import Login from './pages/login/login';
import ShipperAllOrders from './pages/shipper/shippingOrder/ShipperAllOrders'

function App() {

  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        <Route exact path='/' element={<ShipperAllOrders />} />
        <Route path='/shipper' element={<ShipperAllOrders />} />
        <Route path='/shipper/shipping' element={<ShipperAllOrders />} />
        <Route path='/shipper/success' element={<ShipperAllOrders />} />

        {/* <Route path='/login' element={<Login />} /> */}
        <Route path='/coordinator' element={<CoordinatorDashboard />} />
        <Route path='/coordinator/createOrder' element={<CreateOrder />} />
        {/* <Route path='/shipper' element={<ShipperAllOrders />} /> */}
      </Routes>
    </HashRouter>
  )
}

export default App
