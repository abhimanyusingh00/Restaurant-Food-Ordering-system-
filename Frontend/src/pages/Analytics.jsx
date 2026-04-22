import { useState } from "react";
import api from "../services/api";

function Analytics() {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const loadOrdersByRestaurant = async () => {
    try {
      const res = await api.get("/analytics/orders-by-restaurant");
      setResults(res.data);
      setMessage("Orders by restaurant loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load analytics");
    }
  };

  const loadMonthlySales = async () => {
    try {
      const res = await api.get("/analytics/monthly-sales");
      setResults(res.data);
      setMessage("Monthly sales loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load analytics");
    }
  };

  const loadTopMenuItems = async () => {
    try {
      const res = await api.get("/analytics/top-menu-items");
      setResults(res.data);
      setMessage("Top menu items loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load analytics");
    }
  };

  const loadRestaurantRatings = async () => {
    try {
      const res = await api.get("/analytics/restaurant-ratings");
      setResults(res.data);
      setMessage("Restaurant ratings loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load analytics");
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Analytics</h2>
      <p className="page-subtitle">Run analytics queries and view summarized results.</p>

      {message && <div className="message-success">{message}</div>}

      <div className="button-row" style={{ flexWrap: "wrap", marginBottom: "20px" }}>
        <button className="btn btn-primary" onClick={loadOrdersByRestaurant}>Orders by Restaurant</button>
        <button className="btn btn-primary" onClick={loadMonthlySales}>Monthly Sales</button>
        <button className="btn btn-primary" onClick={loadTopMenuItems}>Top Menu Items</button>
        <button className="btn btn-primary" onClick={loadRestaurantRatings}>Restaurant Ratings</button>
      </div>

      <h3 style={{ marginBottom: "12px" }}>Results</h3>
      <pre className="results-box">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

export default Analytics;