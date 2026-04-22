import { useEffect, useState } from "react";
import api from "../services/api";

function DeliveryAgents() {
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    vehicleType: "",
    availabilityStatus: "",
    assignedArea: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchDeliveryAgents = async () => {
    try {
      const res = await api.get("/deliveryAgents");
      setDeliveryAgents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeliveryAgents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      vehicleType: "",
      availabilityStatus: "",
      assignedArea: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/deliveryAgents/${editingId}`, formData);
        setMessage("Delivery agent updated successfully");
      } else {
        await api.post("/deliveryAgents", formData);
        setMessage("Delivery agent added successfully");
      }

      setIsError(false);
      clearForm();
      fetchDeliveryAgents();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save delivery agent");
      setIsError(true);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      fullName: item.fullName || "",
      phone: item.phone || "",
      vehicleType: item.vehicleType || "",
      availabilityStatus: item.availabilityStatus || "",
      assignedArea: item.assignedArea || "",
    });
    setEditingId(item._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deliveryAgents/${id}`);
      setMessage("Delivery agent deleted successfully");
      setIsError(false);
      fetchDeliveryAgents();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete delivery agent");
      setIsError(true);
    }
  };

  return (
    <div className="page-card">
      <h2 className="page-title">Delivery Agents</h2>
      <p className="page-subtitle">Manage delivery staff and assigned areas.</p>

      {message && (
        <div className={isError ? "message-error" : "message-success"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="vehicleType"
            placeholder="Vehicle Type"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          />
          <input
            name="availabilityStatus"
            placeholder="Availability Status"
            value={formData.availabilityStatus}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="assignedArea"
          placeholder="Assigned Area"
          value={formData.assignedArea}
          onChange={handleChange}
          required
        />

        <div className="button-row">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update Delivery Agent" : "Add Delivery Agent"}
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
              <th>Phone</th>
              <th>Vehicle Type</th>
              <th>Availability</th>
              <th>Assigned Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryAgents.length > 0 ? (
              deliveryAgents.map((item) => (
                <tr key={item._id}>
                  <td>{item.fullName}</td>
                  <td>{item.phone}</td>
                  <td>{item.vehicleType}</td>
                  <td>{item.availabilityStatus}</td>
                  <td>{item.assignedArea}</td>
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
                <td colSpan="6">No delivery agents found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryAgents;