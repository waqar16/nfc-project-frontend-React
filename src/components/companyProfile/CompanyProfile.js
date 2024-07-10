import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import styles from '../../assets/css/profiles/CompanyProfile.module.css';

const CompanyProfile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    id: userId,
    company_name: '',
    admin_name: '',
    email: '',
    phone: '',  
    address: '',
    company_description: '',
    website: '',
    employees: [],
  });
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { id, company_name, admin_name, email, profile_type, username: authenticatedUsername } = userResponse.data;

        
        if (profile_type !== 'company' || userId !== id.toString() || username !== authenticatedUsername) {
          console.log(`UserId from URL: ${userId}, User ID from response: ${id}`);
          navigate('/not-authorized');
          return;
        }

        try {
          const companyResponse = await axios.get(`http://127.0.0.1:8000/api/companies/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setCompany({
            id: userId,
            company_name: companyResponse.data.company_name || '',
            admin_name: companyResponse.data.admin_name || '',
            email: email || '',
            phone: companyResponse.data.phone || '',
            address: companyResponse.data.address || '',
            company_description: companyResponse.data.company_description || '',
            website: companyResponse.data.website || '',
            employees: companyResponse.data.employees || [],
          });
          setProfileExists(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Company profile does not exist
            setCompany({
              id: userId,
              company_name: company_name || '',
              admin_name: admin_name || '',
              email: email || '',
              phone: '',
              address: '',
              company_description: '',
              website: '',
              employees: [],
            });
            setProfileExists(false);
          } else {
            console.error('Error fetching company profile:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCompanyData();
  }, [navigate, userId, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
  
      if (profileExists) {
        await axios.put(`http://127.0.0.1:8000/api/companies/${company.id}/`, company, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        alert('Company profile updated successfully!');
      } else {
        const createResponse = await axios.post('http://127.0.0.1:8000/api/companies/', company, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
  
        const createdCompanyId = createResponse.data.id;
  
        // Update state with newly created profile's ID
        setCompany((prevCompany) => ({
          ...prevCompany,
          id: createdCompanyId,
        }));
  
        alert('Company profile created successfully!');
        setProfileExists(true); // Update profile existence state
      }
  
    } catch (error) {
      console.error('Error updating/creating company profile:', error);
      alert('Failed to update/create company profile.');
    }
  };

  return (
    <div className={styles.companyProfileContainer}>
      <Sidebar profileType="company" />
            {/* Preview Card */}
            <div className={styles.previewCard}>
        <h2>{company.company_name}</h2>
        <p>{company.company_description}</p>
        <div className={styles.contactInfo}>
          <p><i className="ri-mail-fill"></i> {company.email}</p>
          <p><i className="ri-phone-fill"></i> {company.phone}</p>
          <p><i className="ri-map-pin-fill"></i> {company.address}</p>
          <p><i className="ri-global-fill"></i> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
        </div>
      </div>
      <div className={styles.formContainer}>
        <h2>Company Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hidden input for company ID */}
          <input
            type="hidden"
            name="id"
            value={company.id}
            onChange={handleChange}
            className={styles.input}
          />
          {/* Company Name */}
          <label className={styles.label}>
            Company Name:
            <input
              type="text"
              name="company_name"
              value={company.company_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          {/* Admin Name */}
          <label className={styles.label}>
            Admin Name:
            <input
              type="text"
              name="admin_name"
              value={company.admin_name}
              onChange={handleChange}
              className={styles.input}
              readOnly // Assuming admin name is not editable
            />
          </label>
          {/* Email */}
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              className={styles.input}
              readOnly // Assuming email is not editable
              required
            />
          </label>
          {/* Phone */}
          <label className={styles.label}>
            Phone:
            <input
              type="tel"
              name="phone"
              value={company.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          {/* Address */}
          <label className={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          {/* Company Description */}
          <label className={styles.label}>
            Company Description:
            <textarea
              name="company_description"
              value={company.company_description}
              onChange={handleChange}
              className={styles.textarea}
            ></textarea>
          </label>
          {/* Website */}
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
          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default CompanyProfile;
