const Users = require("./models");

const createUser = async (googleId, username, email, password) => {
  const user = await Users.create({
    googleId,
    username,
    email,
    password,
  });
  return user;
};

const getUserById = async (googleId) => {
  const user = await Users.findOne({ googleId });
};
