import React, { useState } from 'react';
import styles from '../../assets/css/authentication/Authentication.module.css';
import { Link } from 'react-router-dom';

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    industry: '',
    adminName: '',
    adminEmail: '',
    adminPhoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    numberOfEmployees: '',
    businessHours: '',
    companyDescription: '',
    logo: null,
    nfcCardRequirements: '',
    appointmentSchedulingPreferences: '',
    termsAndConditions: false,
    facebook: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    referralCode: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit} className={styles.login__form}>
        <h2 className={styles.login__title}>Company Signup</h2>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="companyName" className={styles.login__label}>Company Name</label>
            <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="companyEmail" className={styles.login__label}>Company Email</label>
            <input type="email" name="companyEmail" placeholder="Company Email" value={formData.companyEmail} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="phoneNumber" className={styles.login__label}>Phone Number</label>
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="address" className={styles.login__label}>Address</label>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="city" className={styles.login__label}>City</label>
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="state" className={styles.login__label}>State/Province</label>
            <input type="text" name="state" placeholder="State/Province" value={formData.state} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="zipCode" className={styles.login__label}>Zip/Postal Code</label>
            <input type="text" name="zipCode" placeholder="Zip/Postal Code" value={formData.zipCode} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="country" className={styles.login__label}>Country</label>
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="website" className={styles.login__label}>Website</label>
            <input type="url" name="website" placeholder="Website" value={formData.website} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="industry" className={styles.login__label}>Industry</label>
            <input type="text" name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} className={styles.login__input} />
          </div>
        </div>

        {/* <div className={styles.login__group}>
          <div>
            <label htmlFor="adminName" className={styles.login__label}>Admin Name</label>
            <input type="text" name="adminName" placeholder="Admin Name" value={formData.adminName} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="adminEmail" className={styles.login__label}>Admin Email</label>
            <input type="email" name="adminEmail" placeholder="Admin Email" value={formData.adminEmail} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="adminPhoneNumber" className={styles.login__label}>Admin Phone Number</label>
            <input type="text" name="adminPhoneNumber" placeholder="Admin Phone Number" value={formData.adminPhoneNumber} onChange={handleChange} className={styles.login__input} required />
          </div>
        </div> */}

        <div className={styles.login__group}>
          {/* <div>
            <label htmlFor="username" className={styles.login__label}>Username</label>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className={styles.login__input} required />
          </div> */}
          <div>
            <label htmlFor="password" className={styles.login__label}>Password</label>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className={styles.login__input} required />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={styles.login__label}>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className={styles.login__input} required />
          </div>
        </div>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="businessType" className={styles.login__label}>Business Type</label>
            <input type="text" name="businessType" placeholder="Business Type" value={formData.businessType} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="numberOfEmployees" className={styles.login__label}>Number of Employees</label>
            <input type="number" name="numberOfEmployees" placeholder="Number of Employees" value={formData.numberOfEmployees} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="businessHours" className={styles.login__label}>Business Hours</label>
            <input type="text" name="businessHours" placeholder="Business Hours" value={formData.businessHours} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="companyDescription" className={styles.login__label}>Company Description</label>
            <textarea name="companyDescription" placeholder="Company Description" value={formData.companyDescription} onChange={handleChange} className={styles.login__textarea}></textarea>
          </div>
        </div>

        <div className={styles.login__group}>
          <div>
            <label htmlFor="logo" className={styles.login__label}>Upload Logo</label>
            <input type="file" name="logo" onChange={handleChange} className={styles.login__input} />
          </div>
          {/* <div>
            <label htmlFor="nfcCardRequirements" className={styles.login__label}>NFC Card Requirements</label>
            <textarea name="nfcCardRequirements" placeholder="NFC Card Requirements" value={formData.nfcCardRequirements} onChange={handleChange} className={styles.login__textarea}></textarea>
          </div>
          <div>
            <label htmlFor="appointmentSchedulingPreferences" className={styles.login__label}>Appointment Scheduling Preferences</label>
            <textarea name="appointmentSchedulingPreferences" placeholder="Appointment Scheduling Preferences" value={formData.appointmentSchedulingPreferences} onChange={handleChange} className={styles.login__textarea}></textarea>
          </div> */}
        </div>

        <div className={styles.login__group}>
          {/* <div>
            <label htmlFor="facebook" className={styles.login__label}>Facebook URL</label>
            <input type="url" name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange} className={styles.login__input} />
          </div> */}
          <div>
            <label htmlFor="linkedin" className={styles.login__label}>LinkedIn URL</label>
            <input type="url" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} className={styles.login__input} />
          </div>
          {/* <div>
            <label htmlFor="instagram" className={styles.login__label}>Instagram URL</label>
            <input type="url" name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="twitter" className={styles.login__label}>Twitter URL</label>
            <input type="url" name="twitter" placeholder="Twitter URL" value={formData.twitter} onChange={handleChange} className={styles.login__input} />
          </div>
          <div>
            <label htmlFor="referralCode" className={styles.login__label}>Referral Code</label>
            <input type="text" name="referralCode" placeholder="Referral Code" value={formData.referralCode} onChange={handleChange} className={styles.login__input} />
          </div> */}
        </div>

        <div className={styles.login__group}>
          <div>
            <label className={styles.login__label}>
              <input type="checkbox" name="termsAndConditions" checked={formData.termsAndConditions} onChange={handleChange} className={styles.login__checkbox} />
              I agree to the <Link to="/terms-and-conditions" target="_blank">terms and conditions</Link>
            </label>
          </div>
        </div>

        <div>
          <button type="submit" className={styles.login__button}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default CompanySignup;
