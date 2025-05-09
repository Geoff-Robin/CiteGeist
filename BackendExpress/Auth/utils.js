//bunch of middlewares for authentication


const jwt = require("jsonwebtoken");
const {getUserById} = require("../Users/controller")
require("dotenv").config();

const checkAccessToken = async(req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json({
      message: "Not logged in or accessToken cookie missing",
    });
  else{
    jwt.verify(req.cookies.access_token,process.env.SECRET_KEY,(err,authData) => {
        if(err){
            res.status(403)
        }
        else{
            return req.authData = authData;
        }
    })
    next();
  }
};

const signAccessToken = async (req, res) => {
    const token = jwt.sign({ userId: req.user_id }, process.env.SECRET_KEY, { expiresIn: '5m' });
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 5 * 60 * 1000
    });
  };
  
  const signRefreshToken = async (req, res) => {
    const token = jwt.sign({ userId: req.user_id }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: '1d',
    });
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000
    });
  };
  

module.exports = {
    signRefreshToken,
    signAccessToken,    
    checkAccessToken
}