import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from '../../assets/css/profiles/CompanyProfile.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';
import { uploadFileToS3 } from '../../s3Service';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';


const CompanyProfile = () => {

  const { userId, username } = useParams();
  const [logo, setLogo] = useState(null);

  const navigate = useNavigate();
  const [company, setCompany] = useState({
    user: userId,
    company_name: '',
    admin_name: '',
    email: '',
    username: '',
    display_email: '',
    phone: '',
    company_logo: null,
    address: '',
    company_description: '',
    website: '',
    linkedin: '',
    receive_marketing_emails: false,
    employees: [],
  });
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
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

        const updatedCompany = {
          user: id,
          company_name,
          admin_name,
          username: authenticatedUsername,
          email,
        };

        setCompany(updatedCompany);
        setLoading(false);  

        try {
          setLoading(true)
          const companyResponse = await axios.get(`https://api.onesec.shop/api/companies/${username}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          setCompany({
            user: userId,
            company_name: companyResponse.data.company_name || '',
            admin_name: companyResponse.data.admin_name || '',
            email: email || '',
            display_email: companyResponse.data.display_email || '',
            username: companyResponse.data.username || '',
            phone: companyResponse.data.phone || '',
            company_logo: companyResponse.data.company_logo || '',
            address: companyResponse.data.address || '',
            company_description: companyResponse.data.company_description || '',
            website: companyResponse.data.website || '',
            linkedin: companyResponse.data.linkedin || '',
            employees: companyResponse.data.employees || [],
            receive_marketing_emails: companyResponse.data.receive_marketing_emails || false,
          });
          setProfileExists(true);
          setLoading(false)
          localStorage.setItem('company_logo', companyResponse.data.company_logo);
        } catch (error) {
          
          if (error.response && error.response.status === 404) {
            // Company profile does not exist
            setCompany({
              user: userId,
              company_name: company_name || '',
              admin_name: admin_name || '',
              email: email || '',
              display_email: '',
              username: username || '',
              company_logo: '',
              phone: '',
              address: '',
              company_description: '',
              website: '',
              linkedin: '',
              employees: [],
            });
            setProfileExists(false);
            setLoading(false)
          } else {
            setLoading(false)
            navigate('/login');
            console.error('Error fetching company profile:', error);
            toast.error('Error fetching company profile')
          }
        }
      } catch (error) {
        setLoading(false)
        console.error('Error fetching user data:', error);
        toast.error('Error fetching company data')
        navigate('/login')
        localStorage.clear()
      }
    };

    fetchCompanyData();
  }, [navigate, userId, username]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCompany((prevCompany) => ({
  //     ...prevCompany,
  //     [name]: value,
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  
  //   if (type === 'checkbox') {
  //     setCompany((prevCompany) => ({
  //       ...prevCompany,
  //       [name]: checked,
  //     }));
  //   } else {
  //     setCompany((prevCompany) => ({
  //       ...prevCompany,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setCompany(prevCompany => ({
        ...prevCompany,
        [name]: checked,
      }));
    } else {
      setCompany(prevCompany => ({
        ...prevCompany,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setCompany({ ...company, phone: value });
  };
  


  const handlecompany_logoChange = async event => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadResponse = await uploadFileToS3(file, company.user);
        const profileLogoUrl = uploadResponse.Location; 
        console.log('Profile Logo URL:', profileLogoUrl);
  
        // Update the logo URL in the company object
        setCompany(prevCompany => ({
          ...prevCompany,
          company_logo: profileLogoUrl
        }));
        setLogo(profileLogoUrl);
        localStorage.setItem('companyLogo', profileLogoUrl);
  
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload logo.');
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');

      if (profileExists) {
        await axios.put(`https://api.onesec.shop/api/companies/${username}/`, company, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setLoading(false)
        toast.success('Company profile updated successfully!');

      } else {
        const createResponse = await axios.post('https://api.onesec.shop/api/companies/', company, {
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

        toast.success('Company profile created successfully!');
        setProfileExists(true);
        setLoading(false)
      }

    } catch (error) {
      setLoading(false)
      console.error('Error updating/creating company profile:', error.response.data);
      toast.error('Failed to update/create company profile.');
    }
  };

  return (
    <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className={styles.companyProfileContainer}>
      <Sidebar profileType={localStorage.getItem('profile_type')} logo={company.company_logo}/>
      {/* Preview Card */}
      {/* <div className={styles.previewCard}>
        <h2>{company.company_name}</h2>
        <p>{company.company_description}</p>
        <div className={styles.contactInfo}>
          <p><i className="ri-mail-fill"></i> {company.email}</p>
          <p><i className="ri-phone-fill"></i> {company.phone}</p>
          <p><i className="ri-map-pin-fill"></i> {company.address}</p>
          <p><i className="ri-global-fill"></i> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
        </div>
      </div> */}
      <div className={styles.formContainer}>
        <h2 className='text-2xl text-bold'>Company Profile Management</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.profilePicContainer}>
        {company.company_logo ? (
          <img src={company.company_logo} alt="Profile" className={styles.logo} />
        ) : (
          <>
          <span style={{"padding":"30px"}}>Your Logo Here</span>
          </>
        )}        
     <label htmlFor="profilePicInput" className={styles.editIcon}>
              <i className="ri-edit-2-line"></i>
            </label>
            <input
              type="file"
              id="profilePicInput"
              className={styles.profilePicInput}
              onChange={handlecompany_logoChange}
              accept="image/*"
            />
          </div>
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
              required
            />
          </label>
          {/* Email */}
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={company.email}
              placeholder='email@example.com'
              onChange={handleChange}
              className={styles.input}
              readOnly // Assuming email is not editable
              required
            />
          </label>
          <label className={styles.label}>
            Display Email:
            <input
              type="email"
              name="display_email"
              value={company.display_email}
              placeholder='email@example.com'
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          {/* Phone */}
          <label className={styles.label}>
            Phone Number:
            <PhoneInput
              country={'sa'}
              value={company.phone}
              onChange={handlePhoneChange}
              inputClass={styles.input}
              specialLabel=""
            />
          </label>
          {/* <label className={styles.label}>
            Compnay Logo:
            <input
              type="file"
              id="company_logo"
              className={styles.input}
              onChange={handlecompany_logoChange}
              accept="image/*"
            />
          </label> */}

          {/* Address */}
          <label className={styles.label}>
            Address:
            {/* <PlacesAutocomplete
              required
              value={company.address || ''}
              onChange={(address) => setCompany({ ...company, address })}
              onSelect={(address) => {
                geocodeByAddress(address)
                  .then((results) => getLatLng(results[0]))
                  .then((latLng) => {
                    console.log('Success:', latLng);
                    setCompany({ ...company, address }); // Set selected address
                  })
                  .catch((error) => console.error('Error:', error));
              }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Enter your address',
                      className: styles.input,
                    })}
                  />
                  <div className={styles.autocompleteDropdownContainer}>
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? styles.suggestionItemActive
                        : styles.suggestionItem;
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                          key={suggestion.placeId}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete> */}
              <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your address"
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
              placeholder='Tell us about your company...'
              required
            ></textarea>
          </label>
          {/* Website */}
          <label className={styles.label}>
            Website (Optional):
            <input
              type="url"
              name="website"
              value={company.website}
              placeholder='https://example.com'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label>
            LinkedIn (Optional):
            <input
              type="url"
              name="linkedin"
              value={company.linkedin}
              placeholder='https://linkedin.com/company'
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              name="receive_marketing_emails"
              checked={company.receive_marketing_emails}
              onChange={handleChange}
              className={styles.checkbox}
            />
            Receive marketing emails
          </label>
          {/* Submit Button */}
          <button type='submit'   className={styles.buttonSaveProfile}>
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>

        </form>
      </div>
      <ToastContainer/>
      {loading && <Loader/>}
    </div>
    </div>
  );
};

export default CompanyProfile;
