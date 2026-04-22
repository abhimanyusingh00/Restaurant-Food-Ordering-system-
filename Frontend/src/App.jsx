import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import Categories from "./pages/Categories.jsx";
import MenuItems from "./pages/MenuItems.jsx";
import Orders from "./pages/Orders.jsx";
import OrderItems from "./pages/OrderItems.jsx";
import Payments from "./pages/Payments.jsx";
import DeliveryAgents from "./pages/DeliveryAgents.jsx";
import Reviews from "./pages/Reviews.jsx";
import Coupons from "./pages/Coupons.jsx";
import Queries from "./pages/Queries.jsx";
import Analytics from "./pages/Analytics.jsx";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  return (
    <div className="layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`main-area ${sidebarOpen && window.innerWidth > 900 ? "" : "full"}`}>
        <Navbar setSidebarOpen={setSidebarOpen} />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/menu-items" element={<MenuItems />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-items" element={<OrderItems />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/delivery-agents" element={<DeliveryAgents />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;