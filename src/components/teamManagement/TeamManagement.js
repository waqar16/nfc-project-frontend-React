import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import 'remixicon/fonts/remixicon.css';
import styles from '../../assets/css/profiles/Team.module.css';
import Sidebar from '../sidebar/Sidebar';

const TeamManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    phone: '',
    company: '',
  });
  const [companyId, setCompanyId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompanyAndEmployees();
  }, []);

  const fetchCompanyAndEmployees = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const companyResponse = await axios.get('http://127.0.0.1:8000/api/companies/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      if (companyResponse.data.length > 0) {
        const company = companyResponse.data[0];
        setCompanyId(company.id);
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          company: company.id,
        }));
      }

      fetchEmployees(token);
    } catch (error) {
      console.error('Error fetching company and employees:', error);
    }
  };

  const fetchEmployees = async (token) => {
    try {
      const employeeResponse = await axios.get('http://127.0.0.1:8000/api/employees/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/api/employees/${employee.id}/`, employee, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        alert('Employee updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/employees/', employee, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        alert('Employee created successfully!');
      }
      fetchEmployees(token);
      resetForm();
    } catch (error) {
      console.error('Error submitting employee:', error);
      alert('Failed to submit employee.');
    }
  };

  const resetForm = () => {
    setEmployee({
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      position: '',
      phone: '',
      company: companyId,
    });
    setIsEditing(false);
  };

  const handleEdit = (emp) => {
    setEmployee({
      id: emp.id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      phone: emp.phone,
      company: emp.company,
    });
    setIsEditing(true);
  };

  return (
    <div className={styles.teamManagementContainer}>
        <Sidebar  profileType="company"/>
      <div className={styles.formContainer}>
        <h2>{isEditing ? 'Edit Employee' : 'Create Employee'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="hidden"
            name="company"
            value={employee.company}
            onChange={handleChange}
          />
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              name="first_name"
              value={employee.first_name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={employee.last_name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Position:
            <input
              type="text"
              name="position"
              value={employee.position}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone:
            <input
              type="text"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            {isEditing ? 'Update Employee' : 'Create Employee'}
          </button>
        </form>
      </div>
      <div className={styles.listContainer}>
        <h2>Employee List</h2>
        <ul className={styles.employeeList}>
          {employees.map((emp) => (
            <li key={emp.id} className={styles.employeeItem}>
              <div className={styles.employeeInfo}>
                <p><i className="ri-user-3-line"></i> <strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
                <p><i className="ri-mail-line"></i> <strong>Email:</strong> {emp.email}</p>
                <p><i className="ri-briefcase-line"></i> <strong>Position:</strong> {emp.position}</p>
                <p><i className="ri-phone-line"></i> <strong>Phone:</strong> {emp.phone}</p>
                <div className={styles.actionIcons}>
                  <i className="ri-edit-line" onClick={() => handleEdit(emp)}></i>
                  {/* Add a delete icon and functionality if needed */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamManagement;
