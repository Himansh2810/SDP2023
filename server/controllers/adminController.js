const User=require("../model/userModel");


module.exports.getAllUsersDet = async (req,res,next) => {
    try{

        const verify=req.body.verify;

        if(verify === "admin-dochat"){
            const allUsers = await User.find();
            return res.json(allUsers);
       }
        

    }catch(ex){
        next(ex);
    }
}

module.exports.deleteUser = async (req,res,next) => {
    try{

        const verify=req.body.verify;
        const usern=req.body.usern;

        if(verify === "admin-dochat"){
            const modUsers = await User.findOneAndDelete({username:usern});

            return res.json(modUsers);
       }
        

    }catch(ex){
        next(ex);
    }
}
