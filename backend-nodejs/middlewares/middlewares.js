const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) return res.sendStatus(403);
    
    // Use the payload to find the full user document
    try {
      const user = await Users.findById(payload.user_id);
      if (!user) return res.sendStatus(404); // User not found
      
      req.user = user; // Attach full Mongoose document to req.user
      next();
    } catch (error) {
      console.error("Error fetching user:", error);
      res.sendStatus(500);
    }
  });
}

module.exports = authenticateToken;
