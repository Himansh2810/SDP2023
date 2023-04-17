const User=require("../model/userModel")
const ActiveUsers=require("../model/statusModel");
const bcrypt=require('bcrypt')

module.exports.regCtrl = async (req,res,next) => {
    try{
        const {name,username,email,password,joinedOn} = req.body;
        const usernameCheck = await User.findOne({username})
        if(usernameCheck){
            return res.json({msg:"Username already exits 🤓",valid:false})
        }
        const emailCheck= await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already exits 🤓",valid:false})
        }

        const hashedPswd = await bcrypt.hash(password,10);

        const user= await User.create({
            name,
            email,
            username,
            password:hashedPswd,
            joinedOn
        });

        delete user.password;

        return res.json({user,valid:true})
     }catch(e){
        next(e);
    }
}

module.exports.logCtrl = async (req,res,next) => {
    try{
        const {username,password} = req.body;
        const userdet = await User.findOne({username})
        const isPswdValid =await bcrypt.compare(password,userdet.password)
        if(!userdet || !isPswdValid){
            return res.json({msg:"Incorrect Details ! 🤓",valid:false})
        }

        delete userdet.password;
        

        return res.json({userdet,valid:true})
     }catch(e){
       // next(e);
      
        return res.json({e,valid:false})

    }
}

module.exports.getAllUsers=async (req,res,next) => {
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "name",
            "_id",
            "profilePic",
        ]);

        return res.json(users);

    }catch(err)
    {
        next(err);
    }
}

module.exports.profCtrl =  async (req,res,next) =>{
    try{
        const username=req.body.user;
        const profilePic=req.body.image;
       

        const userData=await User.findOneAndUpdate({username:username},{
           $set:{
              isProfileSet:true,
              profilePic:profilePic
           }
        });

        if(userData){
            return res.json({
                isSet:userData.isProfileSet,
                image:userData.profilePic
            });
        }
        else{
            return res.json({isSet:false,image:""});
        }

        
        

    }catch(ex)
    {
        next(ex);
    }
   
} 

module.exports.statusCtrl = async (req,res,next) => {
    try{
        const username=req.body.user;
        const lastSeen=req.body.lastSeen;

        const userss=await ActiveUsers.find({username:username});

        if(userss[0] !== undefined)
        {
            const upd =await ActiveUsers.findOneAndUpdate({username:username},{
                $set:{
                    lastSeen:"Online"
                }
            });

            return res.json(upd);
        }
        else{
            const uStatus= await ActiveUsers.create({
                username,lastSeen:"Online"
            });

            return res.json(uStatus);
        }
       
       
    }catch(ex)
    {
        next(ex);
    }
         
}

module.exports.logoutCtrl=async (req,res,next) =>{
    try{
          const usern=req.body.user;
          const get=req.body.get;

          if(get)
          {
            const ls = await ActiveUsers.find({username:usern}).select(["lastSeen"]);
            return res.json(ls);
          }
          
          const today=new Date();
          var hours = today.getHours();
            var minutes = today.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            const cr_time = hours + ':' + minutes + ' ' + ampm;
            //const cr_time = today.toLocaleTimeString('en-US', { hour12: true });

            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0
            let dd = today.getDate();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const Msgdate = dd + '-' + mm + '-' + yyyy;

            const lastSeen=Msgdate+cr_time

         

          const setls = await ActiveUsers.findOneAndUpdate({username:usern},{
            $set:{
                lastSeen:lastSeen
            }
          });
         
          if(setls)
             return res.json({msg:"ok"});
          else
             return res.json({msg:"error in set lastseen"})

    }catch(ex)
    {
        next(ex);
    }
}

module.exports.activeCtrl=async (req,res,next) =>{
    try{

        const userss=await ActiveUsers.find().select(["username"]);

        var array=[]
        for(i=0;i<userss.length;i++)
        {
            array[i]=userss[i].username;
        }

       return res.json(array);
    }catch(ex){
        next(ex)
    }
}

module.exports.searchFreinds=async (req,res,next)=>{
    try{

        const searchStr=req.body.str;

        const uid=req.body.uid;

        const onlydata=req.body.onlydata;

        if(onlydata === true){
            const chatusers = await User.find({username:uid}).select([
                "username",
                "name",
                "profilePic",
                "_id"
            ]);

            return res.json(chatusers);
        }


        const users = await User.find({_id:{$ne:uid}}).select([
            "email",
            "username",
            "name",
            "_id",
            "profilePic",
        ]);
 
        const frnds=[];
       

        for(var i=0; i<users.length;i++)
        {
            let extt = users[i].username+"";
            let ext2 = users[i].name+"";
            if (extt.toLowerCase().indexOf(searchStr) !== -1) {
                frnds.push(users[i]);
            }
            else if(ext2.toLowerCase().indexOf(searchStr)!== -1) {
                frnds.push(users[i]);
            }
        }

        return res.json(frnds);


    }catch(ex){
       next(ex);
    }
}

module.exports.addFreinds=async (req,res,next)=>{
    try{
         const user=req.body.user;
         const me=req.body.me;
         const userArr = req.body.nUsers;
         const pos=req.body.pos;
         const posst=req.body.post;

         

         if(pos){
            const udt=await User.findOneAndUpdate({username:me},{
                $set:{
                    selectedChats:userArr
                }
            });

            return res.json(udt);
         }

         if(posst)
         {
            
            const userData=await User.findOneAndUpdate({username:me[0]},{
                $addToSet:{
                    selectedChats:user
                }
            },{
                new: true
              });

           const userData2=await User.findOneAndUpdate({username:user[0]},{
                $addToSet:{
                    selectedChats:me
                }
            },{
                new: true
              });
            
  
           return res.json(userData+userData2);
         }
         else{
           const selChat = await User.find({username:me}).select(["selectedChats"]);

           return res.json(selChat);

         }

        



    }catch(ex){
        next(ex);
    }
}


module.exports.getUserData =async (req,res,next)=>{
    try{
          const uname=req.body.uname;

          const ress=await User.find({username:uname});

          return res.json(ress);

    }catch(ex){
        next(ex);
    }
}

module.exports.blockedUsers =async (req,res,next)=>{
    try{
        
        const {me,usern,post} = req.body;

        if(post){
            const userData=await User.findOneAndUpdate({username:me},{
                $addToSet:{
                    blockedUsers:`${me}-${usern}`
                }
                 },{
                new: true
              });

              const userData2=await User.findOneAndUpdate({username:usern},{
                $addToSet:{
                    blockedUsers:`${me}-${usern}`
                }
               },{
                new: true
              });

              return res.json({msg:`User ${usern} blocked Successfully`})

        }
        else{
            const blkusr = await User.find({username:me}).select(["blockedUsers"]);

            return res.json(blkusr);
        }

    }catch(ex){
        next(ex);
    }
}

module.exports.removeBlocked =async (req,res,next)=>{
    try{
          const {me,usern}= req.body;

          const respp=await User.findOneAndUpdate({username:me},{
               $pull :{blockedUsers:`${me}-${usern}`}
          });

          const respp2=await User.findOneAndUpdate({username:usern},{
            $pull :{blockedUsers:`${me}-${usern}`}
          });
            

          return res.json({msg:"Removed from block"});
         

    }catch(ex){
        next(ex);
    }
}