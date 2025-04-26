const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan")



const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

app.get("/",(req,res)=>{
    res.send({
        "message" : "Welcome to CiteGeistBackend"
    })
});

const PORT = process.env.PORT
app.listen(PORT||4100,()=>{
    console.log("Running on port "+(PORT||4100))
})