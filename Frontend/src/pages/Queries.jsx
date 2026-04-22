import { useEffect, useState } from "react";
import api from "../services/api";

function Queries() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const runCustomerOrders = async () => {
    try {
      const res = await api.get(`/queries/customer-orders/${customerId}`);
      setResults(res.data);
      setMessage("Customer orders loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load customer orders");
    }
  };

  const runTopRatedRestaurants = async () => {
    try {
      const res = await api.get("/queries/top-rated-restaurants");
      setResults(res.data);
      setMessage("Top rated restaurants loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load top rated restaurants");
    }
  };

  const runCouponOrders = async () => {
    try {
      const res = await api.get("/queries/coupon-orders");
      setResults(res.data);
      setMessage("Coupon orders loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load coupon orders");
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Queries</h2>
      <p className="page-subtitle">Run multi collection search queries.</p>

      {message && <div className="message-success">{message}</div>}

      <div className="form-grid">
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.fullName}
            </option>
          ))}
        </select>

        <div className="button-row">
          <button className="btn btn-primary" onClick={runCustomerOrders}>
            Customer Orders
          </button>
          <button className="btn btn-primary" onClick={runTopRatedRestaurants}>
            Top Rated Restaurants
          </button>
          <button className="btn btn-primary" onClick={runCouponOrders}>
            Coupon Orders
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: "12px" }}>Results</h3>
      <pre className="results-box">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

export default Queries;