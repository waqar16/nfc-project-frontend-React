import React, { useState } from 'react';
import styles from '../../assets/css/profiles/CompanyProfile.module.css';
import Dashboard from '../dashboard/Dashboard'; // Reusing the Dashboard component for analytics

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    name: 'Tech Innovators Inc.',
    email: 'info@techinnovators.com',
    phone: '+1 800 123 4567',
    address: '456 Innovation Drive, San Francisco, CA, USA',
    bio: 'We are a leading tech company specializing in innovative digital solutions.',
    website: 'https://www.techinnovators.com',
    profilePic: 'path/to/company-logo.png', // Update with your uploaded image path
    employees: [
      { id: 1, name: 'John Doe', position: 'Software Engineer' },
      { id: 2, name: 'Jane Smith', position: 'Product Manager' },
    ],
  });

  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [analytics, setAnalytics] = useState({
    nfc: 300,
    digitalCard: 200,
    total: 500,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompany((prevCompany) => ({
          ...prevCompany,
          profilePic: e.target.result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setCompany((prevCompany) => ({
      ...prevCompany,
      employees: [...prevCompany.employees, { ...newEmployee, id: Date.now() }],
    }));
    setNewEmployee({ name: '', position: '' });
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    setCompany((prevCompany) => ({
      ...prevCompany,
      employees: prevCompany.employees.map((emp) =>
        emp.id === editingEmployee.id ? editingEmployee : emp
      ),
    }));
    setEditingEmployee(null);
  };

  const handleEmployeeEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleDeleteEmployee = (id) => {
    setCompany((prevCompany) => ({
      ...prevCompany,
      employees: prevCompany.employees.filter((emp) => emp.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Company profile updated successfully!');
  };

  return (
    <div className={styles.companyProfileContainer}>
      <div className={styles.formContainer}>
        <h2>Company Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Company Name:
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone:
            <input
              type="text"
              name="phone"
              value={company.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Bio:
            <textarea
              name="bio"
              value={company.bio}
              onChange={handleChange}
              className={styles.textarea}
            ></textarea>
          </label>
          <label className={styles.label}>
            Website:
            <input
              type="url"
              name="website"
              value={company.website}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
      <div className={styles.previewCard}>
        <div className={styles.profilePicContainer}>
          <img src={company.profilePic} alt="Company Logo" className={styles.profilePic} />
          <label htmlFor="profilePicInput" className={styles.editIcon}>
            <i className="ri-edit-2-fill"></i>
          </label>
          <input
            type="file"
            id="profilePicInput"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
        </div>
        <h2>{company.name}</h2>
        <p>{company.bio}</p>
        <div className={styles.contactInfo}>
          <p><i className="ri-mail-fill"></i> {company.email}</p>
          <p><i className="ri-phone-fill"></i> {company.phone}</p>
          <p><i className="ri-map-pin-fill"></i> {company.address}</p>
          <p><i className="ri-global-fill"></i> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
        </div>
      </div>
      <div className={styles.employeesContainer}>
        <h3>Employees</h3>
        <ul className={styles.employeeList}>
          {company.employees.map((employee) => (
            <li key={employee.id} className={styles.employeeItem}>
              {employee.name} - {employee.position}
              <button onClick={() => handleEditEmployee(employee)}>Edit</button>
              <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
            </li>
          ))}
        </ul>
        {editingEmployee ? (
          <form onSubmit={handleUpdateEmployee} className={styles.form}>
            <h3>Edit Employee</h3>
            <label className={styles.label}>
              Name:
              <input
                type="text"
                name="name"
                value={editingEmployee.name}
                onChange={handleEmployeeEditChange}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Position:
              <input
                type="text"
                name="position"
                value={editingEmployee.position}
                onChange={handleEmployeeEditChange}
                className={styles.input}
              />
            </label>
            <button type="submit" className={styles.button}>
              Update Employee
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddEmployee} className={styles.form}>
            <h3>Add Employee</h3>
            <label className={styles.label}>
              Name:
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleEmployeeChange}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Position:
              <input
                type="text"
                name="position"
                value={newEmployee.position}
                onChange={handleEmployeeChange}
                className={styles.input}
              />
            </label>
            <button type="submit" className={styles.button}>
              Add Employee
            </button>
          </form>
        )}
      </div>
      <Dashboard analytics={analytics} />
    </div>
  );
};

export default CompanyProfile;
