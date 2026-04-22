import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
        setMessage("Customer updated successfully");
      } else {
        await api.post("/customers", formData);
        setMessage("Customer added successfully");
      }
      setIsError(false);
      clearForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      setMessage(error.response?.data?.message || "Failed to save customer");
      setIsError(true);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      fullName: customer.fullName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setEditingId(customer._id);
    setMessage("");
    setIsError(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setMessage("Customer deleted successfully");
      setIsError(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      setMessage("Failed to delete customer");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Customers</h2>
      <p className="page-subtitle">
        Add, update, view, and delete customer records.
      </p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Customer" : "Add Customer"}
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
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;