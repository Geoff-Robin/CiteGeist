const mongoose = require("mongoose");
const PaperSchema = mongoose.Schema({
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