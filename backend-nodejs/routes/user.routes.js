const express = require("express");
const user_routes = express.Router();
const { login, register } = require("../controllers/user.controllers");

user_routes.post("/login", login);
user_routes.post("/register", register);

module.exports = user_routes;
