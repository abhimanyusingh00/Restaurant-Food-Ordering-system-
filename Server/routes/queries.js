const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Payment = require("../models/Payment");

router.get("/menu-search", async (req, res) => {
  try {
    const { restaurantId, categoryId, minPrice, maxPrice } = req.query;

    const filter = {};

    if (restaurantId) filter.restaurantId = restaurantId;
    if (categoryId) filter.categoryId = categoryId;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const menuItems = await MenuItem.find(filter)
      .populate("restaurantId", "name")
      .populate("categoryId", "name");

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer-orders/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId })
      .populate("customerId", "fullName email")
      .populate("restaurantId", "name")
      .populate("deliveryAgentId", "fullName")
      .populate("couponId", "code discountValue");

    const payments = await Payment.find({
      orderId: { $in: orders.map((order) => order._id) }
    });

    res.json({ orders, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/top-rated-restaurants", async (req, res) => {
  try {
    const minRating = Number(req.query.minRating || 4);

    const topRated = await Review.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $match: {
          averageRating: { $gte: minRating }
        }
      }
    ]);

    res.json(topRated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/coupon-orders", async (req, res) => {
  try {
    const orders = await Order.find({ couponId: { $ne: null } })
      .populate("customerId", "fullName")
      .populate("restaurantId", "name")
      .populate("couponId", "code discountType discountValue");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;