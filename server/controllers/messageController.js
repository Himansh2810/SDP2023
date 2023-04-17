const messageModel = require("../model/messageModel");

module.exports.addMessage= async (req,res,next) => {
  try{
        const {from , to ,msgtime, message} = req.body;
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
            msgTime:msgtime,
        })

        if(data) return res.json({msg:"Message added successfull"});
        return res.json({msg:"Failed to add message to db"});
  }catch(ex){
    next(ex);
  }
};

module.exports.getAllMessage= async (req,res,next) => {
  try{
   const {from,to} = req.body;
   const messages=await messageModel.find({
    users:{
      $all:[from,to]
    },
   }).sort({updatedAt:1});

   const projectMessages=messages.map((msg)=>{
    return {
      fromSelf:msg.sender.toString() === from,
      message:msg.message.text,
      msgtime:msg.msgTime,
      to:msg.users[0]
    }
   });

   return res.json(projectMessages)

  }catch(ex)
  {
    next(ex);
  }
};

module.exports.deleteMessage =async (req,res,next) => {
  try{
       const {from,to,id} = req.body;

       const delmes = await messageModel.findOneAndDelete({msgTime:id,users:[from,to]});


       return res.json(delmes);

  }
  catch(ex){
     next(ex);
  }
}