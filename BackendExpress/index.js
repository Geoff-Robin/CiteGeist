const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookie_parser = require("cookie-parser")
const mongoose = require("mongoose");
const auth_router = require("./Auth/routes");
const cors = require('cors');
require('dotenv').config();


const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_URI  = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ajcew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express();

app.use(cors());
app.use(cookie_parser())
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));
app.use('/auth',auth_router);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to CiteGeistBackend",
  });
});


const PORT = process.env.PORT;
app.listen(PORT || 3000, async() => {
  console.log("Running on port " + (PORT || 3000)+"\nVisit the api on http://localhost:3000");
  try{
    await mongoose.connect(MONGODB_URI);
    console.log("Your express app successfully connnected to Database ✅");
  }catch(err){
    console.log(err)
  }
});
