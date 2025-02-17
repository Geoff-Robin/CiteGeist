const Users = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const register = async (req, res) => {
  try {
    const { username, email, password, interests } = req.body;
    const encrypted_password = bcrypt(password);
    let user = new Users({
      username,
      email,
      password: encrypted_password,
      interests,
    });
    await user.save();
    user = await Users.findOne({ email });
    const access = jwt.sign(
      { user_id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );
    const refresh = jwt.sign(
      { user_id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    res.status(200).json({
      access,
      refresh,
    });
  } catch (error) {
    console.log("error :", error);
    res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const { email_username, password } = req.body;
  if (email_username.match("@")) {
    const user = await Users.findOne({ email: email_username });
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.status(200).json({
        refresh: getRefreshToken(),
        access: getAccessToken(),
      });
    } else {
      return res.status(400).json({
        message: "Password is not found",
      });
    }
  } else {
    const user = await Users.findOne({ username: email_username });
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.status(200).json({
        refresh: getRefreshToken(),
        access: getAccessToken(),
      });
    } else {
      return res.status(400).json({
        message: "Password is not found",
      });
    }
  }
};

const getRefreshToken = () => {
  const refresh = jwt.sign(
    { user_id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );
};

module.exports = [login, register];
