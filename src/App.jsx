import { HashRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CoordinatorDashboard from './pages/coordinator/coordinatorDashboard/CoordinatorDashboard';
import CreateOrder from './pages/coordinator/createOrder/CreateOrder';

function App() {

  return (
    <HashRouter>
      <ToastContainer/>
      <Routes>
        <Route exact path='/' element={<CoordinatorDashboard/>}/>
        <Route path='/coordinator' element={<CoordinatorDashboard/>}/>
        <Route path='/coordinator/createOrder' element={<CreateOrder/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
