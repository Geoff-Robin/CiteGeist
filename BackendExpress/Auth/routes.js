const express = require("express");
const passport = require("passport");
const {
  signRefreshToken,
  signAccessToken,
  checkAccessToken,
  getHashedPassword,
} = require("./utils");
const { getUserByEmail, getUserByUsername } = require("../Users/controller");
const auth_router = express.Router();
const passportConfig = require("./passport");

auth_router.use(passport.initialize());

auth_router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force",
  })
);

auth_router.get(
  "/google/callback/",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    await signAccessToken(req, res);
    await signRefreshToken(req, res);
    return res;
  }
);

auth_router.get("/verify", checkAccessToken, async (req, res) => {
  if (null === req.authData) {
    res.sendStatus(403);
  } else {
    res.json(req.authData);
  }
});

auth_router.post("/login", async (req, res) => {
  const { email_username, password } = req.body;
  const hashedPassword = await getHashedPassword(password);
  var user = null;
  try {
    if (email_username.includes("@")) {
      user = await getUserByEmail(email_username);
      req.user_id = user._id;
    } else {
      user = await getUserByUsername(email_username);
      req.user_id = user._id;
    }
  } catch (error) {
    res.status(404).send({
      message: error,
    });
  }
  try {
    if (user.password == hashedPassword) {
      await signAccessToken(req, res);
      await signRefreshToken(req, res);
      res.status(200).send({
        message: "Logged In!",
      });
    } else {
      res.status(401).send({
        message: "Unauthorized user!",
      });
    }
  } catch (error) {
    req.status(500).send({
      message: error,
    });
  }
});

auth_router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  var user = null;
  try {
    user = await createUser(username, email, password);
    req.user_id = user._id;
  } catch (error) {
    req.status(409).send({
      message: error,
    });
  }
  try {
    await signAccessToken(req, res);
    await signRefreshToken(req, res);
    res.status(201).send({
      message: "Registered!",
    });
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
});

auth_router.post("/logout", async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = auth_router;
