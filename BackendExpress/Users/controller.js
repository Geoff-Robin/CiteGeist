const Users = require("./models");
const {ObjectId} = require("mongodb")

const createUser = async (username, email, password) => {
  const user = await Users.create({
    username,
    email,
    password,
  });
  return user;
};

const createUserByGoogleOAuth = async (profile) => {
  const user = await Users.create({
    googleId: profile.id,
    email: profile.emails[0].value,
    username: profile.name.givenName + " " + profile.name.familyName,
  });
  return user;
};

const getUserByGoogleId = async (googleId) => {
  const user = await Users.findOne({ googleId: googleId.toString() });
  return user;
};

const getUserById = async (id) => {
  const user = await Users.findOne({ _id: new ObjectId.createFromTime(id)});
  return user;
};

const getUserByEmail = async (email) => {
    const user = await Users.findOne({email});
    return user;
}

const getUserByUsername = async (username) => {
    const user = await Users.findOne({username})
}

module.exports = {
  createUser,
  getUserByGoogleId,
  createUserByGoogleOAuth,
  getUserById,
  getUserByEmail,
  getUserByUsername
};
