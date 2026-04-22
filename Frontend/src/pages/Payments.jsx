import { useEffect, useState } from "react";
import api from "../services/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    paymentMethod: "",
    paymentStatus: "",
    amountPaid: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getId = (value) => (typeof value === "object" && value !== null ? value._id : value);

  const fetchData = async () => {
    try {
      const [paymentRes, orderRes] = await Promise.all([
        api.get("/payments"),
        api.get("/orders"),
      ]);
      setPayments(paymentRes.data);
      setOrders(orderRes.data);
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
      orderId: "",
      paymentMethod: "",
      paymentStatus: "",
      amountPaid: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amountPaid: Number(formData.amountPaid),
      };

      if (editingId) {
        await api.put(`/payments/${editingId}`, payload);
        setMessage("Payment updated successfully");
      } else {
        await api.post("/payments", payload);
        setMessage("Payment added successfully");
      }

      setIsError(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save payment");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      orderId: getId(item.orderId) || "",
      paymentMethod: item.paymentMethod || "",
      paymentStatus: item.paymentStatus || "",
      amountPaid: item.amountPaid || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      setMessage("Payment deleted successfully");
      setIsError(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete payment");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Payments</h2>
      <p className="page-subtitle">Manage payment records using order selection.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <select name="orderId" value={formData.orderId} onChange={handleChange} required>
          <option value="">Select Order</option>
          {orders.map((order) => (
            <option key={order._id} value={order._id}>
              {order._id} | {order.customerId?.fullName || "Customer"}
            </option>
          ))}
        </select>

        <div className="form-row">
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Wallet">Wallet</option>
          </select>

          <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} required>
            <option value="">Select Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <input
          name="amountPaid"
          placeholder="Amount Paid"
          value={formData.amountPaid}
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Payment" : "Add Payment"}
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
              <th>Order</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((item) => (
                <tr key={item._id}>
                  <td>{item.orderId?._id || item.orderId}</td>
                  <td>{item.paymentMethod}</td>
                  <td>{item.paymentStatus}</td>
                  <td>{item.amountPaid}</td>
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
                <td colSpan="5">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;