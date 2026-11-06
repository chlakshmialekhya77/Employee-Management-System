
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Name must contain at least 3 characters'],
    match: [/^[A-Za-z ]+$/, 'Name must contain only letters and spaces']
},

    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
},

    phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
},

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    salary: {
    type: Number,
    required: true,
    min: [1, 'Salary must be greater than zero']
},

    joiningDate: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
