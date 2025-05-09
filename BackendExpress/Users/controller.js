const Users = require("./models");

const createUser = async (username, email, password) => {
  const user = await Users.create({
    username,
    email,
    password,
  });
  return user;
};

const createUserByGoogleOAuth = async(profile) =>{
    const user = await Users.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.name.givenName+" "+profile.name.familyName
    })
    return user;
}

const getUserById = async (googleId) => {
  const user = await Users.findOne({ googleId: googleId.toString() });
  return user
};


module.exports={
    createUser,
    getUserById,
    createUserByGoogleOAuth
};