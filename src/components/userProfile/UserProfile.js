import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import styles from '../../assets/css/profiles/UserProfile.module.css';
import Loader from '../loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFileToS3 } from '../../s3Service';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import defaultProfilePic from '../../assets/img/userPlaceholder.jpg';

const UserProfile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user: '',
    first_name: null,
    last_name: null,
    email: null,
    display_email: null,
    username: null,
    phone: null,
    address: null,
    bio: null,
    position: null,
    website: null,
    facebook: null,
    instagram: null,
    linkedin: null,
    whatsapp: null,
    github: null,
    profile_pic: 'https://th.bing.com/th/id/OIP.apbH6Ab6rTVtvyIlbsyQFAHaGv?w=699&h=636&rs=1&pid=ImgDetMain',
    receive_marketing_emails: false,
  });

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false); // Track if profile exists
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
        // const token = localStorage.getItem('authToken')
        // const profile_type = localStorage.getItem('profile_type')
        // const authenticatedUsername = localStorage.getItem('username')
        // const email = localStorage.getItem('profile_type')
        // const id = localStorage.getItem('userId')
        // const first_name = localStorage.getItem('first_name')
        // const last_name = localStorage.getItem('last_name')


        if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
          navigate('/not-authorized');
          return;
        }

        // Fetch the profile data from the API
        try {
          const profileResponse = await axios.get(`https://api.onesec.shop/api/profiles/${authenticatedUsername}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // If the profile exists, set it in the state and mark it as existing
          setUser(prevUser => ({
            ...prevUser,
            ...profileResponse.data,
            profile_pic: profileResponse.data.profile_pic || localStorage.getItem('profile_pic') || 'https://th.bing.com/th/id/OIP.apbH6Ab6rTVtvyIlbsyQFAHaGv?w=699&h=636&rs=1&pid=ImgDetMain',
            receive_marketing_emails: profileResponse.data.receive_marketing_emails || false,
          }));
          setProfileExists(true); // Mark profile as existing

        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile does not exist, initialize with default values
            setUser(prevUser => ({
              ...prevUser,
              user: id,
              first_name,
              last_name,
              email,
              username: authenticatedUsername,
              profile_pic: localStorage.getItem('profile_pic') || 'https://th.bing.com/th/id/OIP.apbH6Ab6rTVtvyIlbsyQFAHaGv?w=699&h=636&rs=1&pid=ImgDetMain',
            }));
            setProfileExists(false); 
          } else {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile data.');
          }
        }
      } 
      catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId, username]);

  // const handleChange = e => {
  //   const { name, value } = e.target;
  //   setUser(prevUser => ({
  //     ...prevUser,
  //     [name]: value,
  //   }));
  // };
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUser(prevUser => ({
        ...prevUser,
        [name]: checked,
      }));
    } else {
      setUser(prevUser => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setUser({ ...user, phone: value });
  };



  const handleProfilePicChange = async event => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadResponse = await uploadFileToS3(file, user.user);
        const profilePicUrl = `${uploadResponse.Location}?t=${new Date().getTime()}`;   
        setUser(prevUser => ({
          ...prevUser,
          profile_pic: profilePicUrl,
        })); 
        console.log('user:', user);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload profile picture.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // setIsSubmitting(true);
    setLoading(true);


    try {
      const authToken = localStorage.getItem('authToken');
      const url = `https://api.onesec.shop/api/profiles/${user.username}/`;

      if (!profileExists) {
        // If profile does not exist, create it using POST
        await axios.post('https://api.onesec.shop/api/profiles/', user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success('Profile created successfully!');
        setProfileExists(true); // Mark profile as existing after creation
      } else {
        // If profile exists, update it using PUT
        await axios.put(url, user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success('Profile updated successfully!');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update or create profile.');
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <div className={styles.userProfileContainer}>
      {/* <Sidebar profileType="individual" /> */}
      <div className={styles.formContainer}>
        <div className={styles.profileSummaryContainer}>
          <Sidebar profileType={localStorage.getItem('profile_type')} profilePic={user.profile_pic}/>
          <div className={styles.profilePicContainer}>
            <img src={user.profile_pic} alt={'user'} className={styles.profilePic} />
            <label htmlFor="profilePicInput" className={styles.editIcon}>
              <i className="ri-edit-2-line"></i>
            </label>
            <input
              type="file"
              id="profilePicInput"
              className={styles.profilePicInput}
              onChange={handleProfilePicChange}
              accept="image/*"
            />
          </div>
          <div className={styles.profileDetails}>
            <p className={styles.fullName}>{user.first_name} {user.last_name}</p>
            <p className={styles.username}>@{username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="user" value={user.user} />
          {[
            { label: 'First Name', name: 'first_name', type: 'text' },
            { label: 'Last Name', name: 'last_name', type: 'text' },
            { label: 'Email', name: 'email', type: 'text', readOnly: true },
            { label: 'Display Email', name: 'display_email', type: 'text' },
            { label: 'Position', name: 'position', type: 'text' },
            { label: 'Phone', name: 'phone', type: 'phone' },
            // { label: 'Address', name: 'address', type: 'text', },
            { label: 'Bio', name: 'bio', type: 'textarea' },
            { label: 'Website (Optional)', name: 'website', type: 'url' },
            { label: 'Facebook (Optional)', name: 'facebook', type: 'url' },
            { label: 'Instagram (Optional)', name: 'instagram', type: 'url' },
            { label: 'LinkedIn (Optional)', name: 'linkedin', type: 'url' },
            // { label: 'GitHub (Optional)', name: 'github', type: 'url' },
            { label: 'WhatsApp (Optional)', name: 'whatsapp', type: 'phone' },
          ].map(({ label, name, type, readOnly = false }) => (
            <label key={name} className={styles.label}>
              {label}:
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={user[name]}
                  placeholder={name==='bio' ? 'Tell us about yourself...' : ''}
                  onChange={handleChange}
                  className={styles.textarea}
                  required
                />
              ) : type === 'phone' ? (
                <PhoneInput
                  country={'sa'}
                  value={user.phone}
                  onChange={handlePhoneChange}
                  inputClass={styles.input}
                  specialLabel=""
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  className={styles.input}
                  readOnly={readOnly}
                  placeholder={
                    name === 'website' ? 'https://example.com' :
                    name === 'facebook' ? 'https://facebook.com/username' :
                    name === 'instagram' ? 'https://instagram.com/username' :
                    name === 'linkedin' ? 'https://linkedin.com/in/username' :
                    name === 'position' ? 'e.g Software Engineer' : 
                    name === 'address' ? 'e.g Riyadh, Saudi Arabia' :
                    name === 'display_email' ? 'This email will be displayed on your digital card' : ''

                  }             
                  />
              )}
            </label>
          ))}

          <label className={styles.label}>
            Address:
            <PlacesAutocomplete
              value={user.address || ''}
              onChange={(address) => setUser({ ...user, address })}
              onSelect={(address) => {
                geocodeByAddress(address)
                  .then((results) => getLatLng(results[0]))
                  .then((latLng) => {
                    console.log('Success:', latLng);
                    setUser({ ...user, address }); // Set selected address
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
            </PlacesAutocomplete>
          </label>


          <label className={styles.label}>
            <input
              type="checkbox"
              name="receive_marketing_emails"
              checked={user.receive_marketing_emails}
              onChange={handleChange}
              className={styles.checkbox}
            />
            Receive marketing emails
          </label>
          <button
            type="submit"
            className={styles.buttonSaveProfile}
            disabled={isSubmitting || loading} // Disable button while submitting
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from '../sidebar/Sidebar';
// import styles from '../../assets/css/profiles/UserProfile.module.css';
// import Loader from '../loader/Loader';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { uploadFileToS3 } from '../../s3Service';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';
// import defaultProfilePic from '../../assets/img/userPlaceholder.jpg';
// import Avatar from 'react-avatar-edit';

// const UserProfile = () => {
//   const { userId, username } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     user: '',
//     first_name: null,
//     last_name: null,
//     email: null,
//     display_email: null,
//     username: null,
//     phone: null,
//     address: null,
//     bio: null,
//     position: null,
//     website: null,
//     facebook: null,
//     instagram: null,
//     linkedin: null,
//     whatsapp: null,
//     github: null,
//     profile_pic: defaultProfilePic,
//     receive_marketing_emails: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [profileExists, setProfileExists] = useState(false); // Track if profile exists
//   const [isSubmitting, setIsSubmitting] = useState(false);  // Track form submission state
//   const [cropVisible, setCropVisible] = useState(false); // Control crop modal visibility
//   const [preview, setPreview] = useState(null); // Preview cropped image
//   const [croppedImage, setCroppedImage] = useState(null); // Cropped image to be uploaded



//   useEffect(() => {
//     window.scrollTo(0, 0);

//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         const userResponse = await axios.get('https://api.onesec.shop/auth/users/me/', {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });

//         const { id, first_name, last_name, email, profile_type, username: authenticatedUsername } = userResponse.data;
//         // const token = localStorage.getItem('authToken')
//         // const profile_type = localStorage.getItem('profile_type')
//         // const authenticatedUsername = localStorage.getItem('username')
//         // const email = localStorage.getItem('profile_type')
//         // const id = localStorage.getItem('userId')
//         // const first_name = localStorage.getItem('first_name')
//         // const last_name = localStorage.getItem('last_name')


//         if (profile_type !== 'individual' || userId !== id.toString() || username !== authenticatedUsername) {
//           navigate('/not-authorized');
//           return;
//         }

//         // Fetch the profile data from the API
//         try {
//           const profileResponse = await axios.get(`https://api.onesec.shop/api/profiles/${authenticatedUsername}/`, {
//             headers: {
//               Authorization: `Token ${token}`,
//             },
//           });

//           // If the profile exists, set it in the state and mark it as existing
//           setUser(prevUser => ({
//             ...prevUser,
//             ...profileResponse.data,
//             profile_pic: profileResponse.data.profile_pic || localStorage.getItem('profile_pic') || defaultProfilePic,
//             receive_marketing_emails: profileResponse.data.receive_marketing_emails || false,
//           }));
//           setProfileExists(true); // Mark profile as existing

//         } catch (error) {
//           if (error.response && error.response.status === 404) {
//             // Profile does not exist, initialize with default values
//             setUser(prevUser => ({
//               ...prevUser,
//               user: id,
//               first_name,
//               last_name,
//               email,
//               username: authenticatedUsername,
//               profile_pic: localStorage.getItem('profile_pic') || defaultProfilePic,
//             }));
//             setProfileExists(false); 
//           } else {
//             console.error('Error fetching profile:', error);
//             toast.error('Failed to fetch profile data.');
//           }
//         }
//       } 
//       catch (error) {
//         console.error('Error fetching user data:', error);
//         navigate('/');
//         localStorage.clear();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [navigate, userId, username]);

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     if (type === 'checkbox') {
//       setUser(prevUser => ({
//         ...prevUser,
//         [name]: checked,
//       }));
//     } else {
//       setUser(prevUser => ({
//         ...prevUser,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePhoneChange = (value) => {
//     setUser({ ...user, phone: value });
//   };



//   // Handle crop save
//   const onCrop = (view) => {
//     setPreview(view); // Preview cropped image
//   };

//   // Close cropping modal without saving
//   const onClose = () => {
//     setPreview(null);
//     setCropVisible(false);
//   };

//   const handleProfilePicChange = async () => {
//     if (croppedImage) {
//       setLoading(true);
//       try {
//         const uploadResponse = await uploadFileToS3(croppedImage, user.user);
//         const profilePicUrl = `${uploadResponse.Location}?t=${new Date().getTime()}`;
//         setUser(prevUser => ({
//           ...prevUser,
//           profile_pic: profilePicUrl,
//         }));
//         setCropVisible(false);
//         toast.success('Profile picture updated successfully!');
//       } catch (error) {
//         toast.error('Failed to upload profile picture.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Trigger when user selects file
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setCropVisible(true); // Open cropping modal
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     // setIsSubmitting(true);
//     setLoading(true);


//     try {
//       const authToken = localStorage.getItem('authToken');
//       const url = `https://api.onesec.shop/api/profiles/${user.username}/`;

//       if (!profileExists) {
//         // If profile does not exist, create it using POST
//         await axios.post('https://api.onesec.shop/api/profiles/', user, {
//           headers: {
//             Authorization: `Token ${authToken}`,
//           },
//         });
//         toast.success('Profile created successfully!');
//         setProfileExists(true); // Mark profile as existing after creation
//       } else {
//         // If profile exists, update it using PUT
//         await axios.put(url, user, {
//           headers: {
//             Authorization: `Token ${authToken}`,
//           },
//         });
//         toast.success('Profile updated successfully!');
//       }

//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error('Failed to update or create profile.');
//     } finally {
//       setLoading(false);
//       setIsSubmitting(false); // Re-enable the submit button
//     }
//   };

//   return (
//     <div className={styles.userProfileContainer}>
//       {/* <Sidebar profileType="individual" /> */}
//       <div className={styles.formContainer}>
//         <div className={styles.profileSummaryContainer}>
//           <Sidebar profileType={localStorage.getItem('profile_type')} profilePic={user.profile_pic}/>
//           <div className={styles.profilePicContainer}>
//             <img src={user.profile_pic} alt={'user'} className={styles.profilePic} />
//             <label htmlFor="profilePicInput" className={styles.editIcon}>
//               <i className="ri-edit-2-line"></i>
//             </label>
//             <input
//               type="file"
//               id="profilePicInput"
//               className={styles.profilePicInput}
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//           </div>
//                     {/* Show cropping modal if cropVisible is true */}
//                     {cropVisible && (
//             <div className={styles.cropContainer}>
//               <Avatar
//                 width={150}
//                 height={300}
//                 onCrop={onCrop}
//                 onClose={onClose}
//                 label="Upload a picture"
//                 cropRadius={150}
//               />
//               {preview && (
//                 <div className={styles.previewContainer}>
//                   <h3>Preview</h3>
//                   <img src={preview} alt="Preview" className={styles.croppedPreview} />
//                   <button onClick={handleProfilePicChange} className={styles.saveBtn}>
//                     Save Profile Picture
//                   </button>
//                   <button onClick={onClose} className={styles.cancelBtn}>
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           <div className={styles.profileDetails}>
//             <p className={styles.fullName}>{user.first_name} {user.last_name}</p>
//             <p className={styles.username}>@{username}</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input type="hidden" name="user" value={user.user} />
//           {[
//             { label: 'First Name', name: 'first_name', type: 'text' },
//             { label: 'Last Name', name: 'last_name', type: 'text' },
//             { label: 'Email', name: 'email', type: 'text', readOnly: true },
//             { label: 'Display Email', name: 'display_email', type: 'text' },
//             { label: 'Position', name: 'position', type: 'text' },
//             { label: 'Phone', name: 'phone', type: 'phone' },
//             // { label: 'Address', name: 'address', type: 'text', },
//             { label: 'Bio', name: 'bio', type: 'textarea' },
//             { label: 'Website (Optional)', name: 'website', type: 'url' },
//             { label: 'Facebook (Optional)', name: 'facebook', type: 'url' },
//             { label: 'Instagram (Optional)', name: 'instagram', type: 'url' },
//             { label: 'LinkedIn (Optional)', name: 'linkedin', type: 'url' },
//             // { label: 'GitHub (Optional)', name: 'github', type: 'url' },
//             { label: 'WhatsApp (Optional)', name: 'whatsapp', type: 'phone' },
//           ].map(({ label, name, type, readOnly = false }) => (
//             <label key={name} className={styles.label}>
//               {label}:
//               {type === 'textarea' ? (
//                 <textarea
//                   name={name}
//                   value={user[name]}
//                   placeholder={name==='bio' ? 'Tell us about yourself...' : ''}
//                   onChange={handleChange}
//                   className={styles.textarea}
//                   required
//                 />
//               ) : type === 'phone' ? (
//                 <PhoneInput
//                   country={'sa'}
//                   value={user.phone}
//                   onChange={handlePhoneChange}
//                   inputClass={styles.input}
//                   specialLabel=""
//                 />
//               ) : (
//                 <input
//                   type={type}
//                   name={name}
//                   value={user[name]}
//                   onChange={handleChange}
//                   className={styles.input}
//                   readOnly={readOnly}
//                   placeholder={
//                     name === 'website' ? 'https://example.com' :
//                     name === 'facebook' ? 'https://facebook.com/username' :
//                     name === 'instagram' ? 'https://instagram.com/username' :
//                     name === 'linkedin' ? 'https://linkedin.com/in/username' :
//                     name === 'position' ? 'e.g Software Engineer' : 
//                     name === 'address' ? 'e.g Riyadh, Saudi Arabia' :
//                     name === 'display_email' ? 'This email will be displayed on your digital card' : ''

//                   }             
//                   />
//               )}
//             </label>
//           ))}

//           <label className={styles.label}>
//             Address:
//             <PlacesAutocomplete
//               value={user.address || ''}
//               onChange={(address) => setUser({ ...user, address })}
//               onSelect={(address) => {
//                 geocodeByAddress(address)
//                   .then((results) => getLatLng(results[0]))
//                   .then((latLng) => {
//                     console.log('Success:', latLng);
//                     setUser({ ...user, address }); // Set selected address
//                   })
//                   .catch((error) => console.error('Error:', error));
//               }}
//             >
//               {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                 <div>
//                   <input
//                     {...getInputProps({
//                       placeholder: 'Enter your address',
//                       className: styles.input,
//                     })}
//                   />
//                   <div className={styles.autocompleteDropdownContainer}>
//                     {loading && <div>Loading...</div>}
//                     {suggestions.map((suggestion) => {
//                       const className = suggestion.active
//                         ? styles.suggestionItemActive
//                         : styles.suggestionItem;
//                       return (
//                         <div
//                           {...getSuggestionItemProps(suggestion, { className })}
//                           key={suggestion.placeId}
//                         >
//                           <span>{suggestion.description}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </PlacesAutocomplete>
//           </label>


//           <label className={styles.label}>
//             <input
//               type="checkbox"
//               name="receive_marketing_emails"
//               checked={user.receive_marketing_emails}
//               onChange={handleChange}
//               className={styles.checkbox}
//             />
//             Receive marketing emails
//           </label>
//           <button
//             type="submit"
//             className={styles.buttonSaveProfile}
//             disabled={isSubmitting || loading} // Disable button while submitting
//           >
//             {profileExists ? 'Update Profile' : 'Create Profile'}
//           </button>
//         </form>
//       </div>
//       {loading && <Loader />}
//       <ToastContainer />
//     </div>
//   );
// };

// export default UserProfile;


