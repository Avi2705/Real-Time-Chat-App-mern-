import mongoose from "mongoose";
const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: " ",
    },
    email: {
        type: String,
        default: "",
    },
},
    { timestamps: true },
)
const User = mongoose.model("User", schema);
export default User;