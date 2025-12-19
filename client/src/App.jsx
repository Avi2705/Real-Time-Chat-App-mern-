import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../Context/Authcontext.jsx";
import React from "react";
// import { BrowserRouter, Routes } from "react-router-dom";


const App = () => {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
