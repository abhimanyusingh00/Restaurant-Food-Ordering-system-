const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Review = require("../models/Review");

router.get("/orders-by-restaurant", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          totalOrders: { $sum: 1 }
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/monthly-sales", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/top-menu-items", async (req, res) => {
  try {
    const data = await OrderItem.aggregate([
      {
        $group: {
          _id: "$menuItemId",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 5
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/restaurant-ratings", async (req, res) => {
  try {
    const data = await Review.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;