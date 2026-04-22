import { useEffect, useState } from "react";
import api from "../services/api";

function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    restaurantId: "",
    categoryId: "",
    name: "",
    description: "",
    price: "",
    isAvailable: true,
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getId = (value) => (typeof value === "object" && value !== null ? value._id : value);

  const fetchData = async () => {
    try {
      const [menuRes, restaurantRes, categoryRes] = await Promise.all([
        api.get("/menuItems"),
        api.get("/restaurants"),
        api.get("/categories"),
      ]);
      setMenuItems(menuRes.data);
      setRestaurants(restaurantRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "isAvailable"
        ? e.target.value === "true"
        : e.target.value;

    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const clearForm = () => {
    setFormData({
      restaurantId: "",
      categoryId: "",
      name: "",
      description: "",
      price: "",
      isAvailable: true,
      stock: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingId) {
        await api.put(`/menuItems/${editingId}`, payload);
        setMessage("Menu item updated successfully");
      } else {
        await api.post("/menuItems", payload);
        setMessage("Menu item added successfully");
      }

      setIsError(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save menu item");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      restaurantId: getId(item.restaurantId) || "",
      categoryId: getId(item.categoryId) || "",
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      isAvailable: item.isAvailable,
      stock: item.stock || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/menuItems/${id}`);
      setMessage("Menu item deleted successfully");
      setIsError(false);
      fetchData();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete menu item");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Menu Items</h2>
      <p className="page-subtitle">Manage menu items with restaurant and category selection.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <select name="restaurantId" value={formData.restaurantId} onChange={handleChange} required>
            <option value="">Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>

          <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <input
            name="name"
            placeholder="Menu Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <select name="isAvailable" value={String(formData.isAvailable)} onChange={handleChange}>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Menu Item" : "Add Menu Item"}
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
              <th>Restaurant</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.restaurantId?.name || item.restaurantId}</td>
                  <td>{item.categoryId?.name || item.categoryId}</td>
                  <td>{item.price}</td>
                  <td>{item.isAvailable ? "Yes" : "No"}</td>
                  <td>{item.stock}</td>
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
                <td colSpan="7">No menu items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuItems;