import { useEffect, useState } from "react";
import api from "../services/api";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "",
    discountValue: "",
    expiryDate: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "isActive"
        ? e.target.value === "true"
        : e.target.value;

    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const clearForm = () => {
    setFormData({
      code: "",
      discountType: "",
      discountValue: "",
      expiryDate: "",
      isActive: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
      };

      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
        setMessage("Coupon updated successfully");
      } else {
        await api.post("/coupons", payload);
        setMessage("Coupon added successfully");
      }

      setIsError(false);
      clearForm();
      fetchCoupons();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save coupon");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      code: item.code || "",
      discountType: item.discountType || "",
      discountValue: item.discountValue || "",
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
      isActive: item.isActive,
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setMessage("Coupon deleted successfully");
      setIsError(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete coupon");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Coupons</h2>
      <p className="page-subtitle">Manage coupon codes and discount settings.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <input
            name="code"
            placeholder="Coupon Code"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <input
            name="discountType"
            placeholder="Discount Type"
            value={formData.discountType}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="discountValue"
            placeholder="Discount Value"
            value={formData.discountValue}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <select name="isActive" value={String(formData.isActive)} onChange={handleChange}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Coupon" : "Add Coupon"}
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
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Expiry Date</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((item) => (
                <tr key={item._id}>
                  <td>{item.code}</td>
                  <td>{item.discountType}</td>
                  <td>{item.discountValue}</td>
                  <td>{item.expiryDate ? item.expiryDate.slice(0, 10) : ""}</td>
                  <td>{item.isActive ? "Yes" : "No"}</td>
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
                <td colSpan="6">No coupons found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coupons;