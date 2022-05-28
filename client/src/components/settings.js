import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { getCurrentUser, getUserDetails } from "../services/authService";
import {
  uploadImage,
  updateImage,
  updateUserDetails,
} from "../services/userService";

const Settings = () => {
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();
  const [profilePicture, setProfilePicture] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(
    require("../image/profile.png")
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    age: "",
    email: "",
    occupation: "",
  });

  const gettingUser = async () => {
    const userDetails = await getUserDetails();
    setUserDetails(userDetails);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return <Redirect to="/login" />;
    setUser(user);
    gettingUser();
  }, user);

  useEffect(() => {
    if (userDetails && userDetails.profilePicture) {
      if (userDetails.profilePicture.secure_url) {
        setDisplayedImage(userDetails.profilePicture.secure_url);
      }
    }
    if (userDetails) {
      setInputs({
        name: userDetails.name,
        age: userDetails.age,
        occupation: userDetails.occupation,
      });
    }
  }, userDetails);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setDisplayedImage(reader.result);
      }
    };
    setProfilePicture(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
    setIsUploadingImage(true);
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleImageUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilePicture", profilePicture, profilePicture.name);

    if (userDetails && userDetails.profilePicture) {
      if (userDetails && userDetails.profilePicture.secure_url) {
        try {
          await updateImage(formData);
          window.location = "/settings";
        } catch (ex) {
          console.log(ex);
        }
      }
    } else {
      if (userDetails) {
        try {
          await uploadImage(userDetails._id, formData);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };

  const handleInputUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUserDetails(inputs);
      window.location = "/settings";
    } catch (ex) {
      console.log("Error updating your details.");
    }
  };

  const { name, age, occupation } = inputs;

  return (
    <div className="contaner text-center" style={{ overflowX: "hidden" }}>
      <h1>You can change your settings.</h1>
      <img
        src={displayedImage}
        name="profilePicture"
        className="rounded-circle"
        width={200}
        height={200}
      />
      <input type="file" name="profilePicture" onChange={handleImageChange} />
      <br />
      <br />
      <button
        className="btn btn-warning"
        onClick={handleImageUpdate}
        disabled={!isUploadingImage}
      >
        Change Picture
      </button>
      <div className="row">
        <div className="col">
          <h3>Name</h3>
          <h3>Age</h3>
          <h3>Occupation</h3>
        </div>
        <div className="col">
          <input name="name" type="text" value={name} onChange={handleInputs} />
          <br />
          <br />
          <input name="age" type="number" value={age} onChange={handleInputs} />
          <br />
          <br />
          <input
            name="occupation"
            value={occupation}
            type="text"
            onChange={handleInputs}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-warning" onClick={handleInputUpdate}>
            Update Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;