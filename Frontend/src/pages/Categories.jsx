import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        setMessage("Category updated successfully");
      } else {
        await api.post("/categories", formData);
        setMessage("Category added successfully");
      }
      setIsError(false);
      clearForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save category");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      description: item.description || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setMessage("Category deleted successfully");
      setIsError(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete category");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Categories</h2>
      <p className="page-subtitle">Manage food categories in the system.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <input name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Category" : "Add Category"}
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? categories.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3">No categories found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;