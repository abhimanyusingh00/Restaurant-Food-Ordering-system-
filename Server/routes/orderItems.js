const express = require("express");
const router = express.Router();
const OrderItem = require("../models/OrderItem");

router.get("/", async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate("orderId")
      .populate("menuItemId", "name price");
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate("orderId")
      .populate("menuItemId", "name price");

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const orderItem = new OrderItem(req.body);
    const savedOrderItem = await orderItem.save();
    res.status(201).json(savedOrderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOrderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json(updatedOrderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrderItem = await OrderItem.findByIdAndDelete(req.params.id);

    if (!deletedOrderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json({ message: "Order item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;