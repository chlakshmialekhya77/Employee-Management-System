
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Employee Routes
app.use("/api/employees", employeeRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Employee Management System API is running!");
});

// Start Server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
