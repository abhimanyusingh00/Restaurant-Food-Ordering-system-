import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [counts, setCounts] = useState({
    customers: 0,
    restaurants: 0,
    categories: 0,
    menuItems: 0,
    orders: 0,
    orderItems: 0,
    payments: 0,
    deliveryAgents: 0,
    reviews: 0,
    coupons: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          customers,
          restaurants,
          categories,
          menuItems,
          orders,
          orderItems,
          payments,
          deliveryAgents,
          reviews,
          coupons,
        ] = await Promise.all([
          api.get("/customers"),
          api.get("/restaurants"),
          api.get("/categories"),
          api.get("/menuItems"),
          api.get("/orders"),
          api.get("/orderItems"),
          api.get("/payments"),
          api.get("/deliveryAgents"),
          api.get("/reviews"),
          api.get("/coupons"),
        ]);

        setCounts({
          customers: customers.data.length,
          restaurants: restaurants.data.length,
          categories: categories.data.length,
          menuItems: menuItems.data.length,
          orders: orders.data.length,
          orderItems: orderItems.data.length,
          payments: payments.data.length,
          deliveryAgents: deliveryAgents.data.length,
          reviews: reviews.data.length,
          coupons: coupons.data.length,
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="page-card">
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">
        Quick overview of all collections in the system.
      </p>

      <div className="dashboard-grid">
        <div className="stat-card"><h3>Customers</h3><p>{counts.customers}</p></div>
        <div className="stat-card"><h3>Restaurants</h3><p>{counts.restaurants}</p></div>
        <div className="stat-card"><h3>Categories</h3><p>{counts.categories}</p></div>
        <div className="stat-card"><h3>Menu Items</h3><p>{counts.menuItems}</p></div>
        <div className="stat-card"><h3>Orders</h3><p>{counts.orders}</p></div>
        <div className="stat-card"><h3>Order Items</h3><p>{counts.orderItems}</p></div>
        <div className="stat-card"><h3>Payments</h3><p>{counts.payments}</p></div>
        <div className="stat-card"><h3>Delivery Agents</h3><p>{counts.deliveryAgents}</p></div>
        <div className="stat-card"><h3>Reviews</h3><p>{counts.reviews}</p></div>
        <div className="stat-card"><h3>Coupons</h3><p>{counts.coupons}</p></div>
      </div>
    </div>
  );
}

export default Dashboard;