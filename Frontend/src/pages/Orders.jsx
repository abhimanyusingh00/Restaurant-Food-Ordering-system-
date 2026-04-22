import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    restaurantId: "",
    deliveryAgentId: "",
    couponId: "",
    status: "Pending",
    totalAmount: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getId = (value) => (typeof value === "object" && value !== null ? value._id : value);

  const fetchData = async () => {
    try {
      const [orderRes, customerRes, restaurantRes, deliveryRes, couponRes] = await Promise.all([
        api.get("/orders"),
        api.get("/customers"),
        api.get("/restaurants"),
        api.get("/deliveryAgents"),
        api.get("/coupons"),
      ]);

      setOrders(orderRes.data);
      setCustomers(customerRes.data);
      setRestaurants(restaurantRes.data);
      setDeliveryAgents(deliveryRes.data);
      setCoupons(couponRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({
      customerId: "",
      restaurantId: "",
      deliveryAgentId: "",
      couponId: "",
      status: "Pending",
      totalAmount: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        deliveryAgentId: formData.deliveryAgentId || null,
        couponId: formData.couponId || null,
      };

      if (editingId) {
        await api.put(`/orders/${editingId}`, payload);
        setMessage("Order updated successfully");
      } else {
        await api.post("/orders", payload);
        setMessage("Order added successfully");
      }

      setIsError(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save order");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      customerId: getId(item.customerId) || "",
      restaurantId: getId(item.restaurantId) || "",
      deliveryAgentId: getId(item.deliveryAgentId) || "",
      couponId: getId(item.couponId) || "",
      status: item.status || "Pending",
      totalAmount: item.totalAmount || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setMessage("Order deleted successfully");
      setIsError(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete order");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Orders</h2>
      <p className="page-subtitle">Manage orders with linked customers, restaurants, delivery agents, and coupons.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <select name="customerId" value={formData.customerId} onChange={handleChange} required>
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.fullName}
              </option>
            ))}
          </select>

          <select name="restaurantId" value={formData.restaurantId} onChange={handleChange} required>
            <option value="">Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <select name="deliveryAgentId" value={formData.deliveryAgentId} onChange={handleChange}>
            <option value="">Select Delivery Agent</option>
            {deliveryAgents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.fullName}
              </option>
            ))}
          </select>

          <select name="couponId" value={formData.couponId} onChange={handleChange}>
            <option value="">Select Coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon._id} value={coupon._id}>
                {coupon.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            name="totalAmount"
            placeholder="Total Amount"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Order" : "Add Order"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={clearForm}>
            Clear
          </button>
        </div>
      </form>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Delivery Agent</th>
              <th>Coupon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr key={item._id}>
                  <td>{item.customerId?.fullName || item.customerId}</td>
                  <td>{item.restaurantId?.name || item.restaurantId}</td>
                  <td>{item.status}</td>
                  <td>{item.totalAmount}</td>
                  <td>{item.deliveryAgentId?.fullName || "-"}</td>
                  <td>{item.couponId?.code || "-"}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;