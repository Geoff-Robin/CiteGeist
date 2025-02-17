const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const user_routes = require("./routes/user.routes");
const dotenv = require("dotenv");
const cors = require("cors");
const paper_routes = require("./routes/paper.routes")
dotenv.config();
const corsOptions = {
  origin: "http://localhost:8000",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api", user_routes);
app.use("/api",paper_routes)
let refresh_tokens = [];

app.post("/api/token/refresh/", (req, res) => {
  const refresh = req.body.token;
  if (refresh == null) return res.sendStatus(401);
  if (!refresh_tokens.includes(refresh)) return res.sendStatus(403);
  jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ access: accessToken });
  });
});

app.delete("/api/logout", (req, res) => {
  refresh_tokens = refresh_tokens.filter((token) => token !== req.body.refresh);
  res.sendStatus(200);
});

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ajcew.mongodb.net/CiteGeist?retryWrites=true&w=majority&appName=Cluster0`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.listen(8000, () => {
      console.log(`Server running on port 8000`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

