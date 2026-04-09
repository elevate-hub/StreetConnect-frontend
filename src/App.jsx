import ChatbotPopup from './components/common/ChatbotPopup';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import BottomNav from './components/common/BottomNav';
import ProtectedRoute from './components/common/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingApproval from './pages/auth/PendingApproval';
import VendorOnboarding from './pages/onboarding/VendorOnboarding';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMenu from './pages/vendor/VendorMenu';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorReviews from './pages/vendor/VendorReviews';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorSettings from './pages/vendor/VendorSettings';
import CustomerHome from './pages/customer/CustomerHome';
import VendorDetail from './pages/customer/VendorDetail';
import Cart from './pages/customer/Cart';
import CustomerOrders from './pages/customer/CustomerOrders';
import OrderDetail from './pages/customer/OrderDetail';
import CustomerProfile from './pages/customer/CustomerProfile';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import ActiveDelivery from './pages/delivery/ActiveDelivery';
import DeliveryEarnings from './pages/delivery/DeliveryEarnings';
import DeliveryReviews from './pages/delivery/DeliveryReviews';
import DeliveryProfile from './pages/delivery/DeliveryProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (<>
    {user && <Navbar />}
    <main className="min-h-screen">{children}</main>
    {user && <BottomNav />}
  </>);
};

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending" element={<PendingApproval />} />
      <Route path="/vendor/onboarding" element={<ProtectedRoute roles={['vendor']}><VendorOnboarding /></ProtectedRoute>} />
      <Route path="/vendor/dashboard" element={<ProtectedRoute roles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/menu" element={<ProtectedRoute roles={['vendor']}><VendorMenu /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute roles={['vendor']}><VendorOrders /></ProtectedRoute>} />
      <Route path="/vendor/reviews" element={<ProtectedRoute roles={['vendor']}><VendorReviews /></ProtectedRoute>} />
      <Route path="/vendor/earnings" element={<ProtectedRoute roles={['vendor']}><VendorEarnings /></ProtectedRoute>} />
      <Route path="/vendor/settings" element={<ProtectedRoute roles={['vendor']}><VendorSettings /></ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerHome /></ProtectedRoute>} />
      <Route path="/customer/vendor/:id" element={<ProtectedRoute roles={['customer']}><VendorDetail /></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute roles={['customer']}><CustomerOrders /></ProtectedRoute>} />
      <Route path="/customer/orders/:id" element={<ProtectedRoute roles={['customer']}><OrderDetail /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute roles={['customer']}><CustomerProfile /></ProtectedRoute>} />
      <Route path="/delivery" element={<ProtectedRoute roles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
      <Route path="/delivery/active" element={<ProtectedRoute roles={['delivery']}><ActiveDelivery /></ProtectedRoute>} />
      <Route path="/delivery/earnings" element={<ProtectedRoute roles={['delivery']}><DeliveryEarnings /></ProtectedRoute>} />
      <Route path="/delivery/reviews" element={<ProtectedRoute roles={['delivery']}><DeliveryReviews /></ProtectedRoute>} />
      <Route path="/delivery/profile" element={<ProtectedRoute roles={['delivery']}><DeliveryProfile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute roles={['admin']}><AdminVendors /></ProtectedRoute>} />
      <Route path="/admin/delivery" element={<ProtectedRoute roles={['admin']}><AdminDelivery /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute roles={['admin']}><AdminReviews /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <ChatbotPopup />
  </AppLayout>
);

export default App;
