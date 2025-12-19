import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContext } from "../../Context/Authcontext.jsx";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullname || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const navigate = useNavigate();

  // Update form fields when authUser changes
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullname || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullname: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onloadend = async () => {
      await updateProfile({
        profilePic: reader.result, // base64 string
        fullname: name,
        bio,
      });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-4/6 max-w-3xl backdrop-blur-2xl text-gray-300 border-2 border-gray-200 flex justify-between max-sm:flex-col-reverse rounded-lg p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <h3 className="text-lg font-semibold">Profile details</h3>

          {/* Profile Picture Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setSelectedImg(file);
              }}
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
              className="w-12 h-12 rounded-full"
              alt="Profile avatar"
            />
            Upload profile image
          </label>

          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            required
            placeholder="Write a profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg"
          >
            Save
          </button>
        </form>

        {/* Profile picture preview */}
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon}
          alt="Profile preview"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
