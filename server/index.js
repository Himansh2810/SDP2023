const express = require('express');
const cors=require('cors')
const mongoose=require('mongoose')
const app=express();
const userRoutes = require('./routes/userRoutes');
const messageRoutes =require('./routes/messageRoutes');
const fbRoutes=require("./routes/fbRoutes");
const socket=require("socket.io");
const fetch=require("node-fetch");
const http = require('http').Server(app)


require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() =>{
    console.log("DB connection Successfull")
}).catch((err)=>{
    console.log(err.message)
})

const server= app.listen(process.env.PORT,()=>{
    console.log(`server started on port ${process.env.PORT}`)
})

const usersJoined=[];
global.onlineUsers=new Map();
const io=socket(server)

let onlineUsers=[];

io.on('connection',(socket)=>{
    global.chatSocket=socket;
    socket.on('user-joined',({data})=>{
            if (!onlineUsers.some((user) => user.userId === data)) 
            {  
                onlineUsers.push({ userId: data, socketId: socket.id });   
            }
            io.emit("userOnline",onlineUsers);
            socket.emit('welcome',{user:"admin",mes:`welcome${usersJoined[socket.id]}`});
    })


    socket.on('msg-send',({to,from,msgtime,message,id})=>{
         io.emit("send-msgs",{message:message,msgtime:msgtime,to:to,from:from});   
    })

    socket.on('new-msg-arrival',(data)=>{  
          io.emit("new-arrival",{new:data.new,to:data.to,from:data.from,msg:data.msg});
    })

    socket.on('del-msg',({from,to})=>{
        io.emit("msg-del",{from,to});
    })

    socket.on('disconnect',()=>{
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("userOffline", onlineUsers);
    })
    
})






 


// const usersOnline=[];

// io.on("connection",(socket)=>{
//     global.chatSocket=socket;
//     socket.on("add-user",(userId)=>{
//         onlineUsers.set(userId,socket.id);
//     });

//     socket.on("send-msg",(data)=>{
//         const sendUserSocket=onlineUsers.get(data.to);
//         if(sendUserSocket){
//             socket.to(sendUserSocket).emit("msg-recieve",data.message);
//         }
//     });

//     // socket.on('user-connected',async (data)=>{
//     //    //  console.log('user online:'+data);
//     //    var sid=socket.id;
//     //     usersOnline[sid]=data//.push(data);
//     //     // console.log(usersOnline);
//     //     //"http://localhost:5000/api/auth/onlineUsers"
//     //     // fetch('http://localhost:5000/api/auth/onlineUsers', {
//     //     //     method: 'POST',
//     //     //     headers: {
//     //     //         Accept: 'application/json',
//     //     //         'Content-Type': 'application/json'
//     //     //     },
//     //     //     body:{
//     //     //         users:"ussseerrrs"  
//     //     //     }
//     //     //     });
//     //     // console.log(usersOnline)
//     // });

//     // socket.on('disconnect',()=>{
//     //     console.log('user offline:'+usersOnline[socket.id])
//     //     delete usersOnline[socket.id];
//     // })
// })





// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('login', function(data){
//     console.log('a user ' + data.userId + ' connected');
//     // saving userId to object with socket ID
//     users[socket.id] = data.userId;
//   });

//   socket.on('disconnect', function(){
//     console.log('user ' + users[socket.id] + ' disconnected');
//     // remove saved socket from users object
//     delete users[socket.id];
//   });
// });