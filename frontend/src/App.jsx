
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: ''
  })

  const fetchEmployees = () => {
    fetch('http://localhost:5000/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setEmployee({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      salary: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (emp) => {
    setEmployee({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary
    })

    setEditingId(emp._id)
    setShowForm(true)
    setMessage('')
  }

  
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this employee?'
  )

  if (!confirmDelete) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/employees/${id}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete employee')
    }

    setMessage(data.message || 'Employee deleted successfully')
    fetchEmployees()

  } catch (error) {
    setMessage(error.message)
  }
}


  const handleSubmit = async (e) => {
    e.preventDefault()
if (!/^[0-9]{10}$/.test(employee.phone)) {
  setMessage('Phone number must contain exactly 10 digits')
  return
}
if (Number(employee.salary) <= 0) {
  setMessage('Salary must be greater than zero')
  return
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!emailPattern.test(employee.email)) {
  setMessage('Please enter a valid email address')
  return
}
const namePattern = /^[A-Za-z ]+$/

if (!namePattern.test(employee.name.trim()) || employee.name.trim().length < 3) {
  setMessage('Name must contain at least 3 letters and only alphabets')
  return
}
const emailExists = employees.some((emp) =>
  emp.email.toLowerCase() === employee.email.trim().toLowerCase() &&
  emp._id !== editingId
)

if (emailExists) {
  setMessage('This email address is already registered')
  return
}
    try {
      const url = editingId
        ? `http://localhost:5000/api/employees/${editingId}`
        : 'http://localhost:5000/api/employees'

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed')
      }

      setMessage(
        data.message || (editingId
          ? 'Employee updated successfully'
          : 'Employee added successfully')
      )

      resetForm()
      fetchEmployees()

    } catch (error) {
      setMessage(error.message)
    }
  }
  
const filteredEmployees = employees.filter((emp) => {
  const matchesSearch =
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone.toString().includes(searchTerm) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesDepartment =
    selectedDepartment === 'All' ||
    emp.department.toLowerCase() === selectedDepartment.toLowerCase()

  return matchesSearch && matchesDepartment
})


  return (
    <div className="app">
      <header className="header">
        <h1>Employee Management System</h1>
        <p>Manage your employees in one place</p>
      </header>

      <main className="container">
        <div className="top-section">
          <h2>Employee List</h2>
          <span>Total Employees: {employees.length}</span>

          <button onClick={() => {
            resetForm()
            setMessage('')
            setShowForm(true)
          }}>
            + Add Employee
          </button>
        </div>

        {message && <p>{message}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="employee-form">
            <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>

            <input name="name" placeholder="Name" value={employee.name} onChange={handleChange} required />

            <input name="email" type="email" placeholder="Email" value={employee.email} onChange={handleChange} required />

            <input name="phone" placeholder="Phone" value={employee.phone} onChange={handleChange} required />

            <input name="department" placeholder="Department" value={employee.department} onChange={handleChange} required />

            <input name="designation" placeholder="Designation" value={employee.designation} onChange={handleChange} required />

            <input name="salary" type="number" placeholder="Salary" value={employee.salary} onChange={handleChange} required />

            <button type="submit">
              {editingId ? 'Update Employee' : 'Save Employee'}
            </button>

            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </form>
        )}
        

<div className="search-container">
  <input
    type="text"
    placeholder="Search by name, email, phone, department..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={selectedDepartment}
    onChange={(e) => setSelectedDepartment(e.target.value)}
  >
    <option value="All">All Departments</option>
    <option value="CSE">CSE</option>
    <option value="IT">IT</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="MECH">MECH</option>
  </select>
</div>



        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
  filteredEmployees.map(emp => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>₹{emp.salary}</td>
                    <td>
                      
<button
  className="edit-btn"
  onClick={() => handleEdit(emp)}
>
  Edit
</button>

<button
  className="delete-btn"
  onClick={() => handleDelete(emp._id)}
>
  Delete
</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
