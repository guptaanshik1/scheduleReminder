import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { getCurrentUser, getUserDetails } from "../services/authService";
import { uploadImage } from "../services/userService";

const ImageUpload = () => {
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [displayedImage, setDisplayedImage] = useState(
    require("../image/profile.png")
  );
  const [isUploaded, setIsUploaded] = useState(false);

  const gettingUser = async () => {
    const userDetails = await getUserDetails();
    setUserDetails(userDetails);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return <Redirect to="/login" />;
    setUser(user);
  }, user);

  useEffect(() => {
    if (user) {
      gettingUser();
    }
  }, userDetails);

  console.log(userDetails);

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // 0 -> empty, 1 -> loading, 2 -> done
        // this.setState({ profilePicture: reader.result });
        // console.log(reader)
        setDisplayedImage(reader.result);
      }
    };
    setProfilePicture(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
    setIsUploaded(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profilePicture, profilePicture.name);
    // console.log(formData)
    // console.log(pic)
    try {
      await uploadImage(userDetails._id, formData);
      window.location = "/upload";
      if (user && userDetails && userDetails.role === "user") {
        window.location = "/userdashboard";
      } else if (user && userDetails && userDetails.role === "admin") {
        window.location = "/admindashboard";
      }
      // window.location = '/userdashboard'
    } catch (ex) {
      console.log(ex);
    }
  };

  if (
    user &&
    userDetails &&
    userDetails.role === "user" &&
    userDetails.profilePicture &&
    userDetails.profilePicture.secure_url
  ) {
    return <Redirect to="/userdashboard" />;
  }

  if (
    user &&
    userDetails &&
    userDetails.role === "admin" &&
    userDetails.profilePicture &&
    userDetails.profilePicture.secure_url
  ) {
    return <Redirect to="/admindashboard" />;
  }

  return (
    <form className="container text-center" onSubmit={handleUpload}>
      <img src={displayedImage} className="pic" />
      <input
        name="profilePicture"
        type="file"
        id="profilePicture"
        onChange={handleImage}
      />
      <br />
      <button className="btn btn-danger" disabled={!isUploaded}>
        Upload
      </button>
      {user && user.role === "user" && (
        <Link to="/userdashboard">Skip Uploading the Picture</Link>
      )}
      {user && user.role === "admin" && (
        <Link to="/admindashboard">Skip Uploading the Picture</Link>
      )}
    </form>
  );
};

export default ImageUpload;