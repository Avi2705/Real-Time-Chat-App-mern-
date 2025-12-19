import cloudinary from "../lib/Cloudinary.js";
import Message from "../Models/message.js";
import User from "../Models/User.js";
import {io, userSocketMap} from "../Server.mjs"

// get all users except logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: userId }
        }).select("-password");

        // count unseen messages
        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages,
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};




//get all messages from selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId, receiverId: selectedUserId
                },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId },
            { seen: true }

        );
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true })
    }
    catch {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}

//send Message to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Message text or image is required",
      });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl || null,
    });
// emit the new message to the receiver's socket
const receivedsocketId = userSocketMap[receiverId];
if(receivedsocketId){
    io.to(receivedsocketId).emit("newMessage", newMessage)
}
    res.status(201).json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
