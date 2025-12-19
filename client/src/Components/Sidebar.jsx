import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { Chatcontext } from "../../Context/Chatcontext.jsx";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selecteduser,
    setSelecteduser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(Chatcontext);
  const { logout, onlineUser } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullname.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // Fetch users for sidebar
  useEffect(() => {
    getUsers();
  }, [onlineUser]);

  return (
    <div
      className={`bg-[#8185821A] h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selecteduser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-30" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            placeholder="Search User...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            key={user._id || index}
            onClick={() => {setSelecteduser(user); setUnseenMessages(prev=>({...prev, [user._id]: 0}))}}
            className={`relative flex items-center gap-2 p-2 pl-2 rounded cursor-pointer max-sm:text-sm ${
              selecteduser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile pic"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullname}</p>
              {onlineUser.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {/* Unseen messages count */}
            {unseenMessages?.[user._id] > 0 && (
              <p className="absolute top-1 right-2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 ring-2 ring-[#282142]">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
