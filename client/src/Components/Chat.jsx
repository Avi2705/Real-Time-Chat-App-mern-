import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../Library/Util";
import React from "react";
import { Chatcontext } from "../../Context/Chatcontext";
import { AuthContext } from "../../Context/Authcontext";
import toast from "react-hot-toast";

const Chat = () => {
  const { messages, selecteduser, setSelecteduser, sendMessage, getMessages } =
    useContext(Chatcontext);
  const { authUser, onlineUser } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const scrollEnd = useRef(null);

  // Send text message
  const handlesendmessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Send image message
  const handlesendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Get messages when user selected
  useEffect(() => {
    if (selecteduser?._id) {
      getMessages(selecteduser._id);
    }
  }, [selecteduser]);

  // Scroll to end whenever messages change
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selecteduser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="hello" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selecteduser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selecteduser.fullname}{" "}
          {onlineUser.includes(selecteduser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          src={assets.arrow_icon}
          alt=""
          className="md:hidden w-7"
          onClick={() => setSelecteduser(null)}
        />
        <img src={assets.help_icon} alt="" className="max-w-5 max-md:hidden" />
      </div>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages
          .filter(Boolean)
          .map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.senderId === authUser?._id ? "justify-end" : "flex-row"
              }`}
            >
              {msg.image ? (
                <img
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  src={msg.image}
                  alt=""
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] border border-gray-700 rounded-lg overflow-hidden mb-8 ${
                    msg.senderId === authUser?._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={
                    msg.senderId === authUser?._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selecteduser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handlesendmessage(e) : null)}
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handlesendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handlesendmessage}
          src={assets.send_button}
          alt=""
          className="w-5 mr-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Chat;
