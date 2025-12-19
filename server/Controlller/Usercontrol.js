import bcrypt from "bcryptjs";
import cloudinary from "../lib/Cloudinary.js";
import { generatetoken } from "../lib/utils.js";
import User from "../Models/User.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, bio } = req.body;

    if (!fullname || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generatetoken(newUser._id);

    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      success: true,
      userData,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generatetoken(userData._id);
    const { password: _, ...userDetails } = userData.toObject();

    res.status(200).json({
      success: true,
      userData: userDetails,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHECK AUTH
export const checkauth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullname } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found in request",
      });
    }

    console.log("Received profile update request:");
    console.log("fullname:", fullname);
    console.log("bio:", bio);
    console.log("profilePic exists:", !!profilePic);

    let updateData = { fullname, bio };

    if (profilePic) {
      try {
        const upload = await cloudinary.uploader.upload(profilePic);
        console.log("Cloudinary upload success:", upload.secure_url);
        updateData.profilePic = upload.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed: " + err.message,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    console.log("MongoDB update success for userId:", userId);

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



