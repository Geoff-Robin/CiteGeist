const mongoose = require("mongoose");
const PaperSchema = mongoose.Schema({
    id : {
        type : Number,
        required : true
    },
    title :{
        type : String,
        required : true,
    },
    url : {
        type :String,
    },
    abstract : {
        type : String,
        requried : true,
    },
    authors : String,
});

const Papers = mongoose.model("Papers", PaperSchema);
module.exports = Papers;