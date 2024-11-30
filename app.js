require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));


// Middleware
app.use(cors());
app.use(express.json());

app.options('*', cors()); // Preflight request handler


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});


app.use(
  cors({
    origin:  "*", // Allow all origins (not recommended for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable cookies in requests and responses (needed for authentication)
  })
);

app.options("*", cors());

// Define a root route to handle GET requests to /
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Role-Based Access Control API!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
