
const Employee = require("../models/Employee");

// 1. Add Employee
const addEmployee = async (req, res) => {
    try {
        
        const employee = await Employee.create(req.body);

        res.status(201).json({
            message: "Employee added successfully",
            employee
        });
    }catch (error) {

    // Handle duplicate email
    if (error.code === 11000 || error.code === 11001) {
        return res.status(409).json({
            message: "Email address already exists"
        });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(err => {
    switch (err.path) {
        case "name":
            if (err.kind === "required") return "Name is required";
            if (err.kind === "minlength") return "Name must contain at least 3 characters";
            return "Name must contain only letters and spaces";

        case "email":
            if (err.kind === "required") return "Email is required";
            return "Please enter a valid email address";

        case "phone":
            if (err.kind === "required") return "Phone number is required";
            return "Phone number must contain exactly 10 digits";

        case "department":
            return "Department is required";

        case "designation":
            return "Designation is required";

        case "salary":
            return "Salary must be greater than zero";

        default:
            return `${err.path} is invalid`;
    }
});

        return res.status(400).json({
            message: messages
        });
    }

    // Handle other errors
    return res.status(500).json({
        message: "Something went wrong while adding employee"
    });
}
};

// 2. Get All Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 3. Get Employee By ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// 4. Update Employee
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {  returnDocument: 'after', runValidators: true  }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {

    if (error.code === 11000 || error.code === 11001) {
        return res.status(409).json({
            message: "Email address already exists"
        });
    }

    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(err => {
            switch (err.path) {
                case "name":
                    if (err.kind === "required") return "Name is required";
                    if (err.kind === "minlength") return "Name must contain at least 3 characters";
                    return "Name must contain only letters and spaces";

                case "email":
                    if (err.kind === "required") return "Email is required";
                    return "Please enter a valid email address";

                case "phone":
                    if (err.kind === "required") return "Phone number is required";
                    return "Phone number must contain exactly 10 digits";

                case "department":
                    return "Department is required";

                case "designation":
                    return "Designation is required";

                case "salary":
                    return "Salary must be greater than zero";

                default:
                    return `${err.path} is invalid`;
            }
        });

        return res.status(400).json({ message: messages });
    }

    return res.status(500).json({
        message: "Something went wrong while updating employee"
    });
}
};

// 5. Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(
            req.params.id
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    addEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
