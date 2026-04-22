import { useEffect, useState } from "react";
import api from "../services/api";

function OrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    menuItemId: "",
    quantity: "",
    itemPrice: "",
    subtotal: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getId = (value) => (typeof value === "object" && value !== null ? value._id : value);

  const fetchData = async () => {
    try {
      const [orderItemRes, orderRes, menuRes] = await Promise.all([
        api.get("/orderItems"),
        api.get("/orders"),
        api.get("/menuItems"),
      ]);
      setOrderItems(orderItemRes.data);
      setOrders(orderRes.data);
      setMenuItems(menuRes.data);
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
      menuItemId: "",
      quantity: "",
      itemPrice: "",
      subtotal: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        itemPrice: Number(formData.itemPrice),
        subtotal: Number(formData.subtotal),
      };

      if (editingId) {
        await api.put(`/orderItems/${editingId}`, payload);
        setMessage("Order item updated successfully");
      } else {
        await api.post("/orderItems", payload);
        setMessage("Order item added successfully");
      }

      setIsError(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save order item");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      orderId: getId(item.orderId) || "",
      menuItemId: getId(item.menuItemId) || "",
      quantity: item.quantity || "",
      itemPrice: item.itemPrice || "",
      subtotal: item.subtotal || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orderItems/${id}`);
      setMessage("Order item deleted successfully");
      setIsError(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete order item");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Order Items</h2>
      <p className="page-subtitle">Manage items included in each order.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <select name="orderId" value={formData.orderId} onChange={handleChange} required>
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order._id} | {order.customerId?.fullName || "Customer"}
              </option>
            ))}
          </select>

          <select name="menuItemId" value={formData.menuItemId} onChange={handleChange} required>
            <option value="">Select Menu Item</option>
            {menuItems.map((menuItem) => (
              <option key={menuItem._id} value={menuItem._id}>
                {menuItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <input
            name="itemPrice"
            placeholder="Item Price"
            value={formData.itemPrice}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="subtotal"
          placeholder="Subtotal"
          value={formData.subtotal}
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Order Item" : "Add Order Item"}
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
              <th>Menu Item</th>
              <th>Quantity</th>
              <th>Item Price</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.orderId?._id || item.orderId}</td>
                  <td>{item.menuItemId?.name || item.menuItemId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.itemPrice}</td>
                  <td>{item.subtotal}</td>
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
                <td colSpan="6">No order items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderItems;