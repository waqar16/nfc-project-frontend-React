import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/css/index/Sidebar.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/img/userPlaceholder.jpg";
import defaultLogo from "../../assets/img/logoPlaceholder.png";

const Sidebar = ({ profileType, profilePic, logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://api.onesec.shop/auth/users/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle errors, e.g., redirect to login page or show error message
      }
    };

    fetchUserData();
  }, []);

  // Fetch profile picture based on profileType and userData
  // useEffect(() => {
  //   const fetchProfilePic = async () => {
  //     if (!userData.username) return;

  //     try {
  //       const token = localStorage.getItem('authToken');
  //       if (profileType === 'company') {
  //         const response = await axios.get(`https://api.onesec.shop/api/companies/${userData.username}/`, {
  //           headers: {
  //             Authorization: `Token ${token}`
  //           }
  //         });
  //         if (response.data.logo) {
  //           setLogo(response.data.logo);
  //         } else {
  //           setLogo(response.data.logo);
  //         }

  //       } else if (profileType === 'individual') {
  //         const response = await axios.get(`https://api.onesec.shop/api/profiles/${userData.username}/`, {
  //           headers: {
  //             Authorization: `Token ${token}`
  //           }
  //         });

  //         if (response.data.profile_pic) {
  //           setProfilePic(response.data.profile_pic);
  //         } else {
  //           setProfilePic(defaultProfilePic);
  //         }

  //       } else if (profileType === 'employee' ) {
  //         const response = await axios.get(`https://api.onesec.shop/api/employees/${userData.username}/`, {
  //           headers: {
  //             Authorization: `Token ${token}`
  //           }
  //         });

  //         if (response.data.profile_pic) {
  //           setProfilePic(response.data.profile_pic);
  //         } else {
  //           setProfilePic(defaultProfilePic);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching profile pic:', error);
  //     }
  //   };

  //   fetchProfilePic();
  // }, [userData, profileType]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
      >
        {/* Profile Section */}
        <div className={styles.profileSection}>
          {profileType === "company" && logo ? (
            <img className={styles.logo} src={logo || defaultLogo} alt="Logo" />
          ) : (
            <img
              className={styles.profilePic}
              src={profilePic || defaultProfilePic}
              alt="Profile"
            />
          )}
          {isOpen && (
            <div className={styles.profileInfo}>
              <p className={styles.profileUsername}>@{userData.username}</p>
              <p className={styles.profileName}>
                {userData.first_name} {userData.last_name}
              </p>
            </div>
          )}
        </div>
        <div className={styles.sidebar__header}></div>
        <ul className={styles.sidebar__list}>
          {profileType === "individual" && (
            <>
              {/* <li className={styles.sidebar__item}>
                <Link to={`/profile-summary/${userData.id}/${userData.username}`}>
                  <i className="ri-user-line"></i>
                  Profile Summary
                </Link>
              </li> */}

              <div
                className={styles.sidebar__toggle}
                onClick={toggleSidebar}
                style={{ zIndex: "20" }}
              >
                <i className="ri-menu-line"></i>
              </div>
              <li className={styles.sidebar__item}>
                <Link to={`/user-profile/${userData.id}/${userData.username}`}>
                  <i className="ri-profile-line"></i>
                  Profile Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/nfc-management/${userData.id}/${userData.username}`}
                >
                  <i className="ri-wifi-line"></i>
                  NFC Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/digital-profile/${userData.id}/${userData.username}`}
                >
                  <i className="ri-file-text-line"></i>
                  Digital Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/manage-appointments/${userData.id}/${userData.username}`}
                >
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/user-analytics/${userData.id}/${userData.username}`}
                >
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/account-deletion/`}>
                  <i className="ri-settings-3-line"></i>
                  Account Deletion
                </Link>
              </li>
              <li className={styles.sidebar__item} onClick={handleLogout}>
                <Link to={`/`}>
                  <i className="ri-logout-box-line"></i>
                  Logout
                </Link>
              </li>
            </>
          )}
          {profileType === "company" && (
            <>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/company-profile/${userData.id}/${userData.username}`}
                >
                  <i className="ri-profile-line"></i>
                  Company Profile
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/team-management/${userData.id}/${userData.username}`}
                >
                  <i className="ri-team-line"></i>
                  Team Management
                </Link>
              </li>

              <li className={styles.sidebar__item}>
                <Link
                  to={`/manage-appointments/${userData.id}/${userData.username}`}
                >
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/company-analytics/${userData.id}/${userData.username}`}
                >
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/company-card/${userData.id}/${userData.username}`}>
                  <i className="ri-file-text-line"></i>
                  Company Card
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link to={`/account-deletion/`}>
                  <i className="ri-settings-3-line"></i>
                  Account Deletion
                </Link>
              </li>
              <li className={styles.sidebar__item} onClick={handleLogout}>
                <Link to={`/`}>
                  <i className="ri-logout-box-line"></i>
                  Logout
                </Link>
              </li>
            </>
          )}
          {profileType === "employee" && (
            <>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/employee-profile/${userData.id}/${userData.username}`}
                >
                  <i className="ri-profile-line"></i>
                  Employee Profile
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/nfc-management/${userData.id}/${userData.username}`}
                >
                  <i className="ri-wifi-line"></i>
                  NFC Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/digital-profile/${userData.id}/${userData.username}`}
                >
                  <i className="ri-file-text-line"></i>
                  Digital Card Management
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/manage-appointments/${userData.id}/${userData.username}`}
                >
                  <i className="ri-calendar-line"></i>
                  Manage Appointments
                </Link>
              </li>
              <li className={styles.sidebar__item}>
                <Link
                  to={`/user-analytics/${userData.id}/${userData.username}`}
                >
                  <i className="ri-bar-chart-line"></i>
                  Analytics
                </Link>
              </li>
              <li className={styles.sidebar__item} onClick={handleLogout}>
                <Link to={`/`}>
                  <i className="ri-logout-box-line"></i>
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* <div className={styles.sidebar__footer}>
          <p>© 2024 by One Sec. All rights reserved.</p>
        </div> */}
      </div>
      <div className={styles.sidebar__toggle} onClick={toggleSidebar}>
        {isOpen ? (
          <i className="ri-close-line"></i> // Close icon when sidebar is open
        ) : (
          <i className="ri-menu-line"></i> // Menu icon when sidebar is closed
        )}
      </div>
    </div>
  );
};

export default Sidebar;
