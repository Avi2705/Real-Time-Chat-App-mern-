import Sidebar from "../Components/Sidebar";
import Chat from "../Components/Chat";
import Rightsidebar from "../Components/Rightsidebar"
import { useContext, useState } from "react";
import React from "react";
import { Chatcontext } from "../../Context/Chatcontext";
// import { BrowserRouter, Routes, Route } from "react-router-dom";


const Homepage = () => {

const {selecteduser} = useContext(Chatcontext);


  return (
    <div className="border  w-full h-screen sm:px-[15%] sm:py-[5%]">
    <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selecteduser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>

          <Sidebar/>
        <Chat />
        <Rightsidebar />
      </div>
    </div>
  )

}

export default Homepage;