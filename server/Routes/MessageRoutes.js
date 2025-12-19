import express, { Router } from "express"
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../Controlller/Messagecontroller.js";


const messagerouter =express.Router();


messagerouter.get("/users", protectRoute, getUsersForSidebar);
messagerouter.get("/:id", protectRoute, getMessages);
messagerouter.post("/send/:id", protectRoute, sendMessage);
messagerouter.get("/mark/:id", protectRoute, markMessageAsSeen);

export default messagerouter;