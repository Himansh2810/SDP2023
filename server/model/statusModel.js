const mongoose=require('mongoose');

const activeUsers=new mongoose.Schema({
    username:{
        type:String,
        default:""
    },
    lastSeen:{
        type:String,
        default:""
    }
});


module.exports=mongoose.model("ActiveUsers",activeUsers);