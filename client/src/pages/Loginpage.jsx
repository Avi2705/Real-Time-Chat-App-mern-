import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";


const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [agree, setAgree] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // --------------------
  // FORM SUBMIT
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Terms agreement check
    if (!agree) {
      toast.error("You must agree to the terms!");
      return;
    }

    // Field validation
    if (currentState === "Signup") {
      if (!fullName || !email || !password || !bio) {
        toast.error("Please fill all fields to create account");
        return;
      }
    }

    if (currentState === "Login") {
      if (!email || !password) {
        toast.error("Please fill email and password to login");
        return;
      }
    }

    // Prepare payload
    const payload = {
      fullname: fullName,
      email,
      password,
      bio,
    };

    // Call AuthContext login
    const success = await login(currentState === "Signup" ? "signup" : "login", payload);
    if (success) navigate("/"); // redirect on success
  };

  // --------------------
  // TOGGLE LOGIN / SIGNUP
  // --------------------
  const toggleState = () => {
    setCurrentState(currentState === "Signup" ? "Login" : "Signup");
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setAgree(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />

      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[350px]"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          <img
            src={assets.arrow_icon}
            alt="toggle"
            className="w-5 cursor-pointer"
            onClick={toggleState}
          />
        </h2>

        {/* Full Name only for Signup */}
        {currentState === "Signup" && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Bio only for Signup */}
        {currentState === "Signup" && (
          <textarea
            rows={4}
            placeholder="Provide a short bio about you"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        )}

        {/* Terms checkbox */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          <p>Agree to the terms of the privacy policy</p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Signup" ? "Create Account" : "Login Now"}
        </button>

        {/* Toggle link */}
        <div>
          {currentState === "Signup" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span onClick={toggleState} className="font-medium text-violet-500 cursor-pointer">
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span onClick={toggleState} className="font-medium text-violet-500 cursor-pointer">
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
