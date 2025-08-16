import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

import { createJwt } from "../utils/tokenUitls.js";

export const register = async (req, res) => {
  console.log(req.body);

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.status(200).json({ msg: "user created" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ name: req.body.name });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
  const token = createJwt({ userId: user._id });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    // secure: process.env.NODE_ENV === "develop",
  });
  res.status(200).json({ msg: "user is logged in" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out" });
};

export const getCurrentUser = async (req, res) => {
  console.log(req.user);

  const user = await User.findById(req.user.userId).select("-password");
  if (!user) {
  }
  res.status(200).json({ user });
};

export const forgotPassword = async (req, res) => {
  const { name, pin, newPassword } = req.body;

  if (pin !== process.env.PIN || pin !== "2025") {
    return res.status(401).json({ msg: "Invalid PIN" });
  }

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ msg: "Password reset successful", user });
};
