const express = require("express");
const passport = require("passport")
const {signRefreshToken,signAccessToken,checkAccessToken} = require("./utils");
const auth_router = express.Router();
const passportConfig = require("./passport")

auth_router.use(passport.initialize())

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
  async(req, res) => {
    await signAccessToken(req, res);
    await signRefreshToken(req,res);
    res.redirect('/auth/verify')
  }
);

auth_router.get("/verify", checkAccessToken, async(req, res) => {
  if (null === req.authData) {
    res.sendStatus(403);
  } else {
    res.json(req.authData);
  }
});

module.exports = auth_router