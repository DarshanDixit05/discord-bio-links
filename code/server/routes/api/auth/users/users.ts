import { Router } from "express";
import editUser from "./editUser.js";
import logoutUser from "./logoutUser.js";
import deleteUser from "./deleteUser.js";

const users = Router();

users.use("/", editUser, deleteUser);
users.use("/logout", logoutUser);

export default users; 