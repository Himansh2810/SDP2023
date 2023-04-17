const mongoose=require('mongoose')

const fbSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    toUser:{
        type:String,
    },
    description:{
        type:String,
        default:""
    },
    date:{
        type:String
    }
})

module.exports=mongoose.model("Feedback",fbSchema);