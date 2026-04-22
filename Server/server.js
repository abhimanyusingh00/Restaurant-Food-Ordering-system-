const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Restaurant Food Ordering System API is running");
});

app.use("/api/customers", require("./routes/customers.js"));
app.use("/api/restaurants", require("./routes/restaurants.js"));
app.use("/api/categories", require("./routes/categories.js"));
app.use("/api/menuItems", require("./routes/menuItems.js"));
app.use("/api/orders", require("./routes/orders.js"));
app.use("/api/orderItems", require("./routes/orderItems.js"));
app.use("/api/payments", require("./routes/payments.js"));
app.use("/api/deliveryAgents", require("./routes/deliveryAgents"));
app.use("/api/reviews", require("./routes/reviews.js"));
app.use("/api/coupons", require("./routes/coupons.js"));
app.use("/api/queries", require("./routes/queries.js"));
app.use("/api/analytics", require("./routes/analytics.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});