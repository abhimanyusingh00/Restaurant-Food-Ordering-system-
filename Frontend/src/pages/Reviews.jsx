import { useEffect, useState } from "react";
import api from "../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    restaurantId: "",
    menuItemId: "",
    rating: "",
    comment: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getId = (value) => (typeof value === "object" && value !== null ? value._id : value);

  const fetchData = async () => {
    try {
      const [reviewRes, customerRes, restaurantRes, menuRes] = await Promise.all([
        api.get("/reviews"),
        api.get("/customers"),
        api.get("/restaurants"),
        api.get("/menuItems"),
      ]);

      setReviews(reviewRes.data);
      setCustomers(customerRes.data);
      setRestaurants(restaurantRes.data);
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
      customerId: "",
      restaurantId: "",
      menuItemId: "",
      rating: "",
      comment: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
      };

      if (editingId) {
        await api.put(`/reviews/${editingId}`, payload);
        setMessage("Review updated successfully");
      } else {
        await api.post("/reviews", payload);
        setMessage("Review added successfully");
      }

      setIsError(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save review");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      customerId: getId(item.customerId) || "",
      restaurantId: getId(item.restaurantId) || "",
      menuItemId: getId(item.menuItemId) || "",
      rating: item.rating || "",
      comment: item.comment || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setMessage("Review deleted successfully");
      setIsError(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete review");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Reviews</h2>
      <p className="page-subtitle">Manage customer reviews with linked selections.</p>

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
          <select name="menuItemId" value={formData.menuItemId} onChange={handleChange} required>
            <option value="">Select Menu Item</option>
            {menuItems.map((menuItem) => (
              <option key={menuItem._id} value={menuItem._id}>
                {menuItem.name}
              </option>
            ))}
          </select>

          <select name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="">Select Rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <input
          name="comment"
          placeholder="Comment"
          value={formData.comment}
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Review" : "Add Review"}
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
              <th>Menu Item</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((item) => (
                <tr key={item._id}>
                  <td>{item.customerId?.fullName || item.customerId}</td>
                  <td>{item.restaurantId?.name || item.restaurantId}</td>
                  <td>{item.menuItemId?.name || item.menuItemId}</td>
                  <td>{item.rating}</td>
                  <td>{item.comment}</td>
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
                <td colSpan="6">No reviews found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reviews;