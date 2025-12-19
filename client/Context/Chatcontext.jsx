import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";
import React from "react";

export const Chatcontext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selecteduser, setSelecteduser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {}); // default object
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get messages from selected user
  const getMessages = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send messages to selected user
  const sendMessage = async (messageData) => {
    if (!selecteduser) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selecteduser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevmessages) => [...prevmessages, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to subscribe to messages for selected user
  const subscribetoMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selecteduser && newMessage.senderId === selecteduser._id) {
        newMessage.seen = true;
        setMessages((prevmessages) => [...prevmessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else if (newMessage.senderId) {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  // function to unsubscribe from messages
  const unsubscribefrommessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribetoMessages();
    return () => unsubscribefrommessages();
  }, [socket, selecteduser]);

  const value = {
    messages,
    users,
    selecteduser,
    getUsers,
    setMessages,
    getMessages,
    sendMessage,
    setSelecteduser,
    unseenMessages,
    setUnseenMessages,
  };

  return <Chatcontext.Provider value={value}>{children}</Chatcontext.Provider>;
};
