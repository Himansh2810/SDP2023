const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        max:50,
        required:true,
    },
    username:{
        type:String,
        min:4,
        max:18,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:40,
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    isProfileSet:{
        type:Boolean,
        default:false
    },
    profilePic:{
        type:String,
        default:""
    },
    joinedOn:{
        type:String,
        default:""
    },
    selectedChats:{
        type:Array,
        default:[]
    },
    blockedUsers:{
        type:Array,
    }
});


module.exports=mongoose.model("Users",userSchema);