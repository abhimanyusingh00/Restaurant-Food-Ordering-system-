const express = require("express");
const router = express.Router();
const DeliveryAgent = require("../models/DeliveryAgent");

router.get("/", async (req, res) => {
  try {
    const deliveryAgents = await DeliveryAgent.find();
    res.json(deliveryAgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const deliveryAgent = await DeliveryAgent.findById(req.params.id);
    if (!deliveryAgent) {
      return res.status(404).json({ message: "Delivery agent not found" });
    }
    res.json(deliveryAgent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const deliveryAgent = new DeliveryAgent(req.body);
    const savedDeliveryAgent = await deliveryAgent.save();
    res.status(201).json(savedDeliveryAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDeliveryAgent = await DeliveryAgent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDeliveryAgent) {
      return res.status(404).json({ message: "Delivery agent not found" });
    }

    res.json(updatedDeliveryAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedDeliveryAgent = await DeliveryAgent.findByIdAndDelete(req.params.id);

    if (!deletedDeliveryAgent) {
      return res.status(404).json({ message: "Delivery agent not found" });
    }

    res.json({ message: "Delivery agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;