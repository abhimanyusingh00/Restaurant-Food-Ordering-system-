const mongoose = require("mongoose");

const deliveryAgentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available"
    },
    assignedArea: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryAgent", deliveryAgentSchema);