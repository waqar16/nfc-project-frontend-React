import React, { useState, useCallback } from "react";
import styles from "../../assets/css/authentication/Authentication.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/logo.png";
// import google from '../../assets/img/socials/google.png';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const LoginPage = () => {
  const [isPersonalLogin, setIsPersonalLogin] = useState(true); // State to toggle between personal and company login
  const toggleLoginMode = () => setIsPersonalLogin(!isPersonalLogin); // Function to toggle login mode
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const closeProfile = useCallback(() => {
    const profile = document.getElementById("profile");
    if (profile) {
      profile.classList.remove("show-profile");
    }
  }, []);
  closeProfile();
  React.useEffect(() => {
    closeProfile();
  }, []);

  const handleGoogleSuccess = async (response) => {
    const tokenId = response.credential;
    try {
      console.log("Google login response:", response);
      const profileType = isPersonalLogin ? "individual" : "company";
      const res = await axios.post(
        `https://api.onesec.shop/auth/custom-google-login/`,
        {
          access_token: tokenId,
          profile_type: profileType,
        }
      );

      // Store the authentication token in localStorage
      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("authToken", res.data.auth_token);
      localStorage.setItem("profile_type", res.data.profile_type);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("first_name", res.data.first_name);
      localStorage.setItem("last_name", res.data.last_name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("authentication_type", "google");
      localStorage.setItem("profile_pic", res.data.profile_pic);

      // Redirect or perform additional actions
      if (res.data.profile_type === "company") {
        navigate(`/company-profile/${res.data.user_id}/${res.data.username}`);
      } else if (res.data.profile_type === "individual") {
        navigate(`/user-profile/${res.data.user_id}/${res.data.username}`);
      } else if (res.data.profile_type === "employee") {
        navigate(`/employee-profile/${res.data.user_id}/${res.data.username}`);
      }

      // navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Google login error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`${error.response.data.error}`);
      } else {
        // alert('An unexpected error occurred. Please try again.');
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failure:", error);
  };

  return (
    <div className={`${styles.login} ${styles.marginCustom}`}>
      <div className={styles.login__form}>
        <div className={styles.login__group}>
          <img src={logo} alt="Logo" className={styles.auth__logo} />
          <h2 className={styles.login__title}>Welcome Back!</h2>
          <p className={styles.login__subtitle}>
            Please choose your account type and enter your credentials to log
            in.
          </p>

          <div className={styles.toggle__container}>
            <button
              className={`${styles.toggle__button} ${
                isPersonalLogin ? styles.active : ""
              }`}
              onClick={() => toggleLoginMode()}
            >
              Individual/Employee
            </button>
            <button
              className={`${styles.toggle__button} ${
                !isPersonalLogin ? styles.active : ""
              }`}
              onClick={() => toggleLoginMode()}
            >
              Company
            </button>
          </div>
          {/* <div className={styles.login__google}>
            <img className={styles.google__icon} src={google}></img>
            Continue with Google
          </div> */}
          <GoogleOAuthProvider clientId={clientId}>
            <div className={styles.login__google}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
            </div>
          </GoogleOAuthProvider>
          <p className={styles.login__or}>or</p>

          {isPersonalLogin ? (
            <PersonalLogin navigate={navigate} />
          ) : (
            <CompanyLogin navigate={navigate} />
          )}

          <p className={styles.login__signup}>
            Don't have an account? <Link to={"/signup"}>Sign up here</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const PersonalLogin = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // window.location.reload();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.onesec.shop/auth/custom/token/login/",
        {
          email,
          password,
        }
      );

      // const response2 = await axios.get('https://api.onesec.shop/api/profile_type/', {
      // });

      // console.log(response2.data.profile_type);

      if (response.status === 200) {
        const authToken = response.data;
        localStorage.setItem("authToken", authToken.auth_token);
        console.log("User logged in successfully:", response.data);
        console.log("Token:", authToken.auth_token);

        // Dispatch custom event to update Navbar state
        const event = new Event("authStatusChanged");
        window.dispatchEvent(event);

        const token = localStorage.getItem("authToken");
        const userResponse = await axios.get(
          "https://api.onesec.shop/auth/users/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const { id, username, profile_type } = userResponse.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("profile_type", profile_type);
        localStorage.setItem("username", username);
        localStorage.setItem("authentication_type", "manual");

        if (profile_type === "company") {
          navigate(`/company-profile/${id}/${username}`);
        } else if (profile_type === "individual") {
          navigate(`/user-profile/${id}/${username}`);
        } else if (profile_type === "employee") {
          navigate(`/employee-profile/${id}/${username}`);
        }

        window.location.reload();

      } else {
        alert("An unexpected error occurred. Please check your internet connection.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error);

      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.detail) {
          setError(data.detail);
        }
        if (data.error) {
          setError(data.error);
        }
      } else {
        console.error("Error logging in user:", error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="email" className={styles.login__label}>
            Email
          </label>
          <input
            required
            type="email"
            placeholder="Write your email"
            id="email"
            className={styles.login__input}
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>
            Password
          </label>
          <div className={styles.passwordContainer}>
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              id="password"
              className={styles.login__input}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.eyeButton}
            >
              {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </button>
          </div>
        </div>
        {error && (
          <p className={styles.error}>
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: "8px", borderRadius: "50%" }}
            ></i>
            {error}
          </p>
        )}
      </div>
      <Link className={styles.login__forgot} to={"/reset-password"}>
        Forgot Password?
      </Link>

      <button type="submit" className={styles.login__button} disabled={loading}>
        {loading ? "Logging In..." : "Log In as Individual/Employee"}
      </button>
    </form>
  );
};

const CompanyLogin = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // window.location.reload();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.onesec.shop/auth/custom/token/login/",
        {
          email,
          password,
        }
      );

      // const response2 = await axios.get('  https://api.onesec.shop/api/profile_type/', {
      // });

      // console.log(response2.data.profile_type);

      if (response.status === 200) {
        const authToken = response.data;
        localStorage.setItem("authToken", authToken.auth_token);
        console.log("User logged in successfully:", response.data);
        console.log("Token:", authToken.auth_token);

        // Dispatch custom event to update Navbar state
        const event = new Event("authStatusChanged");
        window.dispatchEvent(event);

        const token = localStorage.getItem("authToken");
        const userResponse = await axios.get(
          "https://api.onesec.shop/auth/users/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const { id, username, profile_type } = userResponse.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("profile_type", profile_type);
        localStorage.setItem("username", username);
        localStorage.setItem("authentication_type", "manual");

        if (profile_type === "company") {
          navigate(`/company-analytics/${id}/${username}`);
        } else if (profile_type === "individual") {
          navigate(`/user-analytics/${id}/${username}`);
        } else if (profile_type === "employee") {
          navigate(`/employee-profile/${id}/${username}`);
        }
        // Hard refresh the page
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.detail) {
          setError(data.detail);
        }
        if (data.error) {
          setError(data.error);
        }
      } else {
        console.error("Error logging in user:", error.message);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.login__group}>
        <div>
          <label htmlFor="email" className={styles.login__label}>
            Email
          </label>
          <input
            required
            type="email"
            placeholder="Write your email"
            id="email"
            className={styles.login__input}
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.login__label}>
            Password
          </label>
          <div className={styles.passwordContainer}>
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              id="password"
              className={styles.login__input}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.eyeButton}
            >
              {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </button>
          </div>
        </div>
        {error && (
          <p className={styles.error}>
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: "8px", borderRadius: "50%" }}
            ></i>
            {error}
          </p>
        )}{" "}
      </div>
      <Link className={styles.login__forgot} to={"/reset-password"}>
        Forgot Password?
      </Link>

      <button type="submit" className={styles.login__button} disabled={loading}>
        {loading ? "Logging In..." : "Log In as Company"}
      </button>
    </form>
  );
};

export default LoginPage;
