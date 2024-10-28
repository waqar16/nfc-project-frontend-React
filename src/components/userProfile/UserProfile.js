import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import styles from "../../assets/css/profiles/UserProfile.module.css";
import Loader from "../loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFileToS3 } from "../../s3Service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
import Cropper from "react-easy-crop";

export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Add this line
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });

  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Draw the image onto the canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Convert the canvas to a Blob
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob"));
      }
    }, "image/jpeg");
  });
};

const UserProfile = () => {
  const defaultProfilePic = "https://th.bing.com/th/id/OIP.apbH6Ab6rTVtvyIlbsyQFAHaGv?w=699&h=636&rs=1&pid=ImgDetMain";
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user: "",
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
    profile_pic:null,
    receive_marketing_emails: false,
  });

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false); // Track if profile exists
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const [ispositionLengthReached, setIspositionLengthReached] = useState(false);
  const [isnameLengthReached, setIsnameLengthReached] = useState(false);
  const [islinkLengthReached, setIslinkLengthReached] = useState(false);
  const [isemailLengthReached, setIsemailLengthReached] = useState(false);
  const [isphoneLengthReached, setIsphoneLengthReached] = useState(false);
  const [isaddressLengthReached, setIsaddressLengthReached] = useState(false);
  const positionLength = 50;
  const nameLength = 18;
  const linkLength = 70;
  const emailLength = 30;
  const phoneLength = 18;
  const addressLength = 255;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userResponse = await axios.get(
          "https://api.onesec.shop/auth/users/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const {
          id,
          first_name,
          last_name,
          email,
          profile_type,
          username: authenticatedUsername,
        } = userResponse.data;

        if (
          profile_type !== "individual" ||
          userId !== id.toString() ||
          username !== authenticatedUsername
        ) {
          navigate("/not-authorized");
          return;
        }

        try {
          const profileResponse = await axios.get(
            `https://api.onesec.shop/api/profiles/${authenticatedUsername}/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          setUser((prevUser) => ({
            ...prevUser,
            ...profileResponse.data,
            profile_pic:
              profileResponse.data.profile_pic ||
              localStorage.getItem("profile_pic"),
            receive_marketing_emails:
              profileResponse.data.receive_marketing_emails || false,
          }));
          setProfileExists(true); // Mark profile as existing
          localStorage.setItem('profile_pic', profileResponse.data.profile_pic);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setUser((prevUser) => ({
              ...prevUser,
              user: id,
              first_name,
              last_name,
              email,
              username: authenticatedUsername,
              profile_pic:
                localStorage.getItem("profile_pic")
            }));
            setProfileExists(false);
          } else {
            console.error("Error fetching profile:", error);
            toast.error("Failed to fetch profile data.");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId, username]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Character limit logic for "position" field
    if (name === "position") {
      if (value.length > positionLength) {
        setIspositionLengthReached(true);
        return; // Stop updating if max length is reached
      } else {
        setIspositionLengthReached(false);
      }
    }

    if (name === "first_name" || name === "last_name") {
      if (value.length > nameLength) {
        setIsnameLengthReached(true);
        return; // Stop updating if max length is reached
      } else {
        setIsnameLengthReached(false);
      }
    }

    if (name === "display_email") {
      if (value.length > emailLength) {
        setIsemailLengthReached(true);
        return; // Stop updating if max length is reached
      } else {
        setIsemailLengthReached(false);
      }
    }

    if (name === "linkedin" || name === "github" || name === "website" || name === "facebook" || name === "instagram" || name === "whatsapp") {
      if (value.length > linkLength) {
        setIslinkLengthReached(true);
        return; // Stop updating if max length is reached
      } else {
        setIslinkLengthReached(false);
      }
    }

    if (name === "address") {
      if (value.length > addressLength) {
        setIsaddressLengthReached(true);
        return; // Stop updating if max length is reached
      } else {
        setIsaddressLengthReached(false);
      }
    }

    // Update state based on input type
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (value) => {
    setUser({ ...user, phone: value });
    if (value.length > phoneLength) {
      setIsphoneLengthReached(true);
    } else {
      setIsphoneLengthReached(false);
    }
  };

  const [image, setImage] = React.useState(null);
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        // const localImageUrl = URL.createObjectURL(file);
        // console.log(localImageUrl, "loca image");

        const uploadResponse = await uploadFileToS3(file, user.user);
        const profilePicUrl = `${
          uploadResponse.Location
        }?t=${new Date().getTime()}`;
        setUser((prevUser) => ({
          ...prevUser,
          profile_pic: profilePicUrl,
        }));
        console.log("profilePicUrl:", profilePicUrl);
        setImage(profilePicUrl); // Set the preview image
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload profile picture.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      const url = `https://api.onesec.shop/api/profiles/${user.username}/`;

      if (!profileExists) {
        await axios.post("https://api.onesec.shop/api/profiles/", user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success("Profile created successfully!");
        setProfileExists(true);
      } else {
        await axios.put(url, user, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update or create profile.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  const [openImageModal, setOpenImageModal] = React.useState(false);
  useEffect(() => {
    if (openImageModal) {
      // Disable body scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scrolling
      document.body.style.overflow = "auto";
    }

    // Clean up by resetting body scroll when the component unmounts or modal closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openImageModal]);
  const fileInputRef = useRef(null);

  // Function to handle div click and trigger input click
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };
  const [croppedImage, setCroppedImage] = useState(null); // State for the cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // This function will be called when the crop is complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels || !image) return;

    setLoading(true); // Start loading

    try {
      // Get the cropped image as a Blob
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);

      // Create a unique file name
      const fileName = `profile_pic_${user.user}_${Date.now()}.jpeg`;

      // Create a File object from the Blob
      const croppedFile = new File([croppedImageBlob], fileName, {
        type: "image/jpeg",
      });

      // Upload the cropped image to S3
      const uploadResponse = await uploadFileToS3(croppedFile, user.user);

      // Get the S3 URL for the uploaded image
      const profilePicUrl = `${
        uploadResponse.Location
      }?t=${new Date().getTime()}`;

      // Update the user's profile picture with the new S3 URL
      setUser((prevUser) => ({
        ...prevUser,
        profile_pic: profilePicUrl,
      }));

      setImage(null);
      setCroppedImage(profilePicUrl); // Set the cropped image preview with the uploaded one
      // toast.success("Image cropped and uploaded successfully!");
      setOpenImageModal(false); // Close the modal
    } catch (error) {
      console.error("Error cropping or uploading image:", error);
      toast.error("Failed to crop or upload image.");
    } finally {
      setLoading(false); // Stop loading
      setCroppedImage(null);
    }
  };
  return (
    <div className={styles.userProfileContainer}>
      <style></style>
      <div className={styles.formContainer}>
        <div className={styles.profileSummaryContainer}>
          {openImageModal && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
                backdropFilter: "blur(5px)", // Blurred background
                zIndex: "50",
                width: "100%",
                left: "0",
                top: "0",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "auto",
                  backgroundColor: "white",
                  width: "70%",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "20px 20px 20px 20px",
                    borderBottom: "1px gray solid ",
                  }}
                >
                  <h2>Edit Photo</h2>
                  <i
                    className="ri-close-line"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => {
                      setImage(null);
                      setOpenImageModal(false);
                    }}
                  ></i>
                </div>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "auto",
                    padding: "20px ",
                  }}
                >
                  <div
                    htmlFor="profilePicInput"
                    style={{
                      width: "170px",
                      height: "170px",
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "100%",
                      overflow: "hidden",
                      cusrsor: "pointer",
                      border: "2px dashed gray",
                    }}
                    onClick={() => {
                      if (!image) {
                        handleDivClick();
                      }
                    }} // Trigger file input click when div is clicked
                  >
                    {!image && (
                      <>
                        <span style={{ color: "gray", userSelect: "none" }}>
                          Click to upload
                        </span>

                        <input
                          type="file"
                          id="profilePicInput"
                          ref={fileInputRef}
                          className={styles.profilePicInput}
                          onChange={handleProfilePicChange}
                          accept="image/*"
                          style={{
                            display: "none",
                          }}
                        />
                      </>
                    )}
                    {image && !croppedImage && (
                      <div
                        style={{
                          position: "relative",
                          display: "flex ",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "300px", 
                          height: "300px",
                          borderRadius: "100%", 
                          overflow: "hidden",
                        }}
                      >
                        <Cropper
                          style={{
                            width: "500px", // Set to your desired width
                            height: "500px",
                            top: "0",
                            position: "absolute",
                          }}
                          image={image}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                    )}

                    {/* Button to trigger cropping and saving */}

                    {/* Display the cropped image */}
                    {croppedImage && (
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: "20px 20px 20px 20px",
                    borderTop: "1px gray solid ",
                  }}
                >
                  {/* <button
                    type="button"
                    style={{
                      color: "gray",
                      marginRight: "20px",
                      padding: "8px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setImage(null);

                      setOpenImageModal(false);
                    }}
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    style={{
                      color: "white",
                      backgroundColor: "gray",
                      padding: "8px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      await handleSaveCroppedImage();
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          <Sidebar
            profileType={localStorage.getItem("profile_type")}
            profilePic={user.profile_pic}
          />
          <div className={styles.profilePicContainer}>
            <img
              src={user.profile_pic? user.profile_pic : defaultProfilePic}
              alt={"user"}
              className={styles.profilePic}
            />
            <label className={styles.editIcon}>
              <i
                className="ri-edit-2-line "
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenImageModal(true);
                }}
              ></i>
            </label>
          </div>
          <div className={styles.profileDetails}>
            <p className={styles.fullName}>
              {user.first_name} {user.last_name}
            </p>
            <p className={styles.username}>@{username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="user" value={user.user} />
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
              {/* {isnameLengthReached && (
                <p className="mt-1 text-sm text-red-500">
                  Maximum character limit of {nameLength} reached.
                </p>
              )} */}
            
          </label>

          <label className={styles.label}>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {/* {isnameLengthReached && (
                <p className="mt-1 text-sm text-red-500">
                  Maximum character limit of {nameLength} reached.
                </p>
              )} */}
          </label>

          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={styles.input}
              readOnly
            />
          </label>

          <label className={styles.label}>
              Position:
              <input
                type="text"
                className={styles.input}
                name="position"
                value={user.position}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
              {ispositionLengthReached && (
                <p className="mt-1 text-sm text-red-500">
                  Maximum character limit of {positionLength} reached.
                </p>
              )}
            </label>

          <label className={styles.label}>
            Display Email:
            <input
              type="text"
              name="display_email"
              value={user.display_email}
              onChange={handleChange}
              className={styles.input}
            />
              {isemailLengthReached && (
                <p className="mt-1 text-sm text-red-500">
                  Maximum character limit of {emailLength} reached.
                </p>
              )}
          </label>

          <label className={styles.label}>
            Phone:
            <PhoneInput
              country={"sa"}
              value={user.phone}
              onChange={handlePhoneChange}
              inputClass={styles.input}
              specialLabel=""
            />

          </label>

          <label className={styles.label}>
            Bio:
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className={styles.textarea}
            />
          </label>

          <label className={styles.label}>
            Website:
            <input
              type="url"
              name="website"
              value={user.website}
              onChange={handleChange}
              className={styles.input}
            />

          </label>

          <label className={styles.label}>
            Facebook:
            <input
              type="url"
              name="facebook"
              value={user.facebook}
              onChange={handleChange}
              className={styles.input}
            />

            </label>

            <label className={styles.label}>
              Instagram:
              <input
                type="url"
                name="instagram"
                value={user.instagram}
                onChange={handleChange}
                className={styles.input}
              />

            </label>

            <label className={styles.label}>
              LinkedIn:
              <input
                type="url"
                name="linkedin"
                value={user.linkedin}
                onChange={handleChange}
                className={styles.input}
              />

            </label>

          <label className={styles.label}>
            Address:
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your address"
            />
            {isaddressLengthReached && (
              <p className="mt-1 text-sm text-red-500">
                Maximum character limit of {addressLength} reached.
              </p>
            )}

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
            {profileExists ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
      {loading && <Loader />}
      <ToastContainer />
    </div>
    
  );
};

export default UserProfile;
