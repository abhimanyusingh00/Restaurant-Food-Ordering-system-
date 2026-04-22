import { useEffect, useState } from "react";
import api from "../services/api";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cuisineType: "",
    phone: "",
    rating: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      location: "",
      cuisineType: "",
      phone: "",
      rating: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, rating: Number(formData.rating) };
      if (editingId) {
        await api.put(`/restaurants/${editingId}`, payload);
        setMessage("Restaurant updated successfully");
      } else {
        await api.post("/restaurants", payload);
        setMessage("Restaurant added successfully");
      }
      setIsError(false);
      clearForm();
      fetchRestaurants();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save restaurant");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      location: item.location || "",
      cuisineType: item.cuisineType || "",
      phone: item.phone || "",
      rating: item.rating || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/restaurants/${id}`);
      setMessage("Restaurant deleted successfully");
      setIsError(false);
      fetchRestaurants();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete restaurant");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Restaurants</h2>
      <p className="page-subtitle">Manage restaurant details and ratings.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <input name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <input name="cuisineType" placeholder="Cuisine Type" value={formData.cuisineType} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <input name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} required />
        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Restaurant" : "Add Restaurant"}
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
              <th>Name</th>
              <th>Location</th>
              <th>Cuisine</th>
              <th>Phone</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length > 0 ? restaurants.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.cuisineType}</td>
                <td>{item.phone}</td>
                <td>{item.rating}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6">No restaurants found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Restaurants;