import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NoDP from '../assets/nodpp.jpg';
import { getAllMessageRoute, sendMessageRoute , logoutRoute , activeRoute, delMsgRoute, blockUserRoute } from "../utils/ApiRoutes";
import ChatInput from "./chatInput";
import {v4 as uuidv4} from "uuid";
import {MdDelete} from 'react-icons/md';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {BiDotsVerticalRounded} from "react-icons/bi";

//console.log(onlineUsers);

function ChatContainer({currentChat,currentUser,socket,sid,setBlockedUsers,setContactLoaded,setNewMsg,onlineUsers})
{
    const navigate=useNavigate();
    var uname=currentChat.name;
    uname=uname.charAt(0).toUpperCase() + uname.slice(1);

    const [messages,setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const scrollRef=useRef();

    const [delLoader,setDelLoader]=useState(0);
    //let delLoader =0;


    useEffect(()=>{
        async function load(){
            const response=await axios.post(getAllMessageRoute,{
                from:currentUser._id,
                to:currentChat._id
            });
            setMessages(response.data);
        }

        if(currentChat){
            load();
            //console.log("onlens"+onlineUser)
        }
    },[currentChat,delLoader]);

    const funNewMsg = (data) =>{
        socket.emit("new-msg-arrival",data);
    }

   

    const handleSendMsg =async (msg)=>{

      const today=new Date();
      const cr_time = today.toLocaleTimeString('en-US', { hour12: true });

      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
      
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      
      const Msgdate = dd + '-' + mm + '-' + yyyy;

      await axios.post(sendMessageRoute,{
        from:currentUser._id,
        to:currentChat._id,
        msgtime:Msgdate+cr_time,
        message:msg,
      });

      socket.emit("msg-send",{
        to:currentChat.username,
        from:currentUser.username,
        msgtime:Msgdate+cr_time,
        message:msg,
        id:sid
      });

      const msgs=[...messages];
      msgs.push({fromSelf:true,message:msg,msgtime:Msgdate+cr_time});
      setMessages(msgs);
      funNewMsg({new:true,to:currentChat.username,from:currentUser.username,msg:msg.slice(0,7)});
    };

    
  
    useEffect(()=>{
        
        socket.on('send-msgs',(data)=>{
            
            if(data.to === currentUser.username && data.from === currentChat.username)
            {
                
                setArrivalMessage({
                    fromSelf:false,
                    message:data.message,
                    msgtime:data.msgtime,
                    from:data.from
                });


                
            }
        })
        return ()=>{

        }
    },[])


    useEffect(()=>{

        socket.on('msg-del',(data)=>{
      
            if(data.to === currentUser.username)
            {
                let kl=delLoader+1;
                setDelLoader(kl);
            }

        })
        return ()=>{

        }
    },[]);

    useEffect(()=>{
       
        if(arrivalMessage && (arrivalMessage.from === currentChat.username))
        {
          setMessages((prev)=>[...prev,arrivalMessage]);
        }
        
    },[arrivalMessage]);

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour:"smooth"});
    },[messages]);


    const toastOp={
        autoClose:1000,
        pauseOnHover:false,
        draggable:true,
        closeOnClick: true,
    }

    const deleteMsg =async (msgid)=>{
           const delmes= await axios.post(delMsgRoute,{
              from:currentUser._id,
              to:currentChat._id,
              id:msgid
           });

           if(delmes)
           {
            // console.log("mesej deleted successfully");
              let vg = delLoader + Math.random()*100;
              setDelLoader(vg);

              socket.emit('del-msg',{
                from:currentUser.username,
                to:currentChat.username,
              });

              toast.success("Message Deleted Successfully",toastOp);
              
           }
    }
    
    const [showDdl,setShowDdl]=useState(false);

    const openDdl = ()=>{
         if(showDdl)
         {
            setShowDdl(false);
         }
         else{
            setShowDdl(true);
         }
    }

    const showDel = (mid,msg,hide) =>{

        calMsgDate(msg);

       if(document.getElementById(`msgs:${mid}`).getAttribute("class") === "message sended")
       {
        document.getElementById(`${mid}`).style.display="inline";
        if(hide){
            document.getElementById(`${mid}`).style.display="none";
        }
       }


        
    }

    const FunblockUser =async()=>{
 
        const resp=await axios.post(blockUserRoute,{
            me:currentUser.username,
            usern:currentChat.username,
            post:true
        });

        if(resp){
            const resp2=await axios.post(blockUserRoute,{
                me:currentUser.username,
                usern:currentChat.username,
                post:false
            });

            let blkusr=resp2.data[0].blockedUsers;

            setBlockedUsers(blkusr);
            setContactLoaded(false);


            //console.log(blkusr);
        }

    }

    const [currentMsgDate,setMsgDate]=useState()

  //  var hellotime ;
    const showDate=()=>{

        document.getElementById("msg-date").style.display="block";

       const showdate= setTimeout(function () {
            document.getElementById("msg-date").style.display="none";
        }, [1500]);

        return ()=>{
            clearTimeout(showdate);

            document.getElementById("msg-date").style.display="none";
        }

    }
      
    const calMsgDate = (msg)=>{
        let vvv=msg.msgtime+"";
        //let messagtime=vvv.slice(10);
        const monthNames = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];

        let ttm=vvv.slice(0,10).split("-");
        let t1=parseInt(ttm[1]);
        let  hellotime=ttm[0]+" "+monthNames[t1-1]+" "+ttm[2]
        setMsgDate(hellotime);
        
       
    }

    const[status,setStatus]=useState({});
    const [lastSeen,setLastSeen]=useState({});

    useEffect(()=>{

        const check = onlineUsers.find(usr => usr[currentChat.username] === true);


        if(check !== undefined && check[currentChat.username])
        {
           setStatus({[currentChat.username]:true});
        }
        else{
            setStatus({});
            getLs();
        }

    },[onlineUsers,currentChat]);

    const getLs = async ()=>{
        const uStatus = await axios.post(logoutRoute,{
            user:currentChat.username,
            get:true
        });

        if(uStatus)
        {
            //console.log(uStatus.data[0].lastSeen);
            let ccc=uStatus.data[0].lastSeen+"";
            const dt=new Date();
            let mm = dt.getMonth() + 1; // Months start at 0
            let dd = dt.getDate();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const Msgdate = dd + '-' + mm;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            let last_seen;

            if(ccc === "Online")
            {
                setStatus({[currentChat.username]:true});
            }
            else if(Msgdate === ccc.slice(0,5)){
                last_seen = "Active today at "+ccc.slice(10);
            }
            else if( parseInt(dd) === parseInt(ccc.slice(0,2))+1){
                last_seen ="Active yesterday at "+ccc.slice(10);
            }
            else{
                last_seen ="Active on "+ccc.slice(0,2)+" "+monthNames[parseInt(ccc.slice(3,5))-1];
            }


            setLastSeen(prev => ({
                ...prev,
                [currentChat.username]:last_seen
            }));
          //  setLastSeen({[currentChat.username]:uStatus.data[0].lastSeen});
        }
    }

    useEffect(()=>{
       getLs();
    },[currentChat]);

    useEffect(()=>{
        socket.on("new-arrival",(data)=>{
            if(data.to === currentUser.username)
            {
                if(currentChat === undefined  || currentChat.username !== data.from)
                {
                    setNewMsg({new:true,to:data.from,msg:data.msg})
                }
               
            }
        });
       // console.log("heyy")
        return ()=>{

        }
    },[])
  

    var prevtime;
    //var chatnm=currentChat.username;

    return(
        <>
        {
            currentChat && (
                <>
                <Container>
                <div className="chat-header">
                   <div className="user-details">
                       <div className="profile-pic">
                        {
                             currentChat.profilePic !== "" ? (
                                <img src={`data:image/svg+xml;base64,${currentChat.profilePic}`} alt="profilePic"/>
                            ):(
                                <img src={NoDP} alt="no profile "/>
                            )
                        }
                       </div>
                       <div className="username">
                            <p className="u-name">{currentChat.name}</p>
                            <p className="u-uname">{currentChat.username}</p>
                       </div>
                      
                       <div className={status[currentChat.username]?"ls-on":"ls-off"}>
                             <h6>{status[currentChat.username]?"Online":lastSeen?(lastSeen[currentChat.username] === undefined ?"offline":lastSeen[currentChat.username]):"offline"}</h6>
                       </div>
                      
                   </div>
                   <div className={`ddl-menu ${showDdl?"show":""}`} >
                            <button onClick={openDdl}><BiDotsVerticalRounded/></button>
                            {
                                 showDdl?(
                                    <div className="opts">
                                       
                                           
                                            <li onClick={FunblockUser}>Block User</li>
                                        
                                    </div>
                                 ):""
                            }
                    </div>
                </div>
                <div className="chat-messages" onScroll={showDate}>
                    {
                    
                        messages.map((message)=>{
                            let vvv=message.msgtime+"";
                            let messagtime=vvv.slice(10);
                            const monthNames = ["January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October", "November", "December"];
                
                            let ttm=vvv.slice(0,10).split("-");
                            let t1=parseInt(ttm[1]) 
                            //hellotime=ttm[0]+" "+monthNames[t1-1]+" "+ttm[2]
                           // console.log(prevtime+" "+vvv.slice(0,10));
                           
                           
                            return(
                                <div ref={scrollRef} key={uuidv4()} >

                                    {
                                        prevtime === vvv.slice(0,10) ? "":(
                                            <div className="msg-date">
                                                 {ttm[0]+" "+monthNames[t1-1]+" "+ttm[2]}
                                            </div>
                                        )
                                    }
                                    <div id={`msgs:${messagtime}`} className={`message ${message.fromSelf ?"sended":"recieved"}`} onMouseOver={()=>showDel(messagtime,message,false)} onMouseOut={()=>showDel(messagtime,message,true)}>

                                        {
                                            message.fromSelf?(
                                                <>
                                                   <MdDelete  id={messagtime} className="delete-msg" onClick={()=> deleteMsg(vvv)}/>
                                                   <div className="content" >
                                                      {message.message}
                                                   </div>  
                                                </>
                                            ):(
                                               <div className="content" >
                                                    {message.message}
                                                </div>
                                            )
                                        }
                                        
                                       
                                    </div>
                                    <p className={`time ${message.fromSelf ?"":"recv"}`}>{messagtime}</p>
                                    {prevtime = vvv.slice(0,10)}
                                    
                                   
                                </div>
                            )
                        })
                    }
                    <div id="msg-date">
                         {currentMsgDate}
                    </div>
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
           </Container>
           <ToastContainer toastStyle={{ backgroundColor: "rgb(10,1,20)",color:"cornflowerblue", fontfamily: "'Josefin Sans',sans-serif"}} />
            </>
           )
        }
       
        </>
    )
}

const Container=styled.div`
padding-top: 1rem;
display:grid;
grid-template-rows:10% 75% 15%;
gap:0.1rem;
overflow:hidden;
.chat-header{
    display: grid;
    grid-template-columns: 85% 15%;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    z-index: 1;
    .user-details{
        display: flex;
        gap:1rem;
        align-items: center;
        margin-top: -1rem;
        .profile-pic{
            img{
                height:3rem;
                border-radius:50%;
            }
        }
        .username{
            .u-name{
                color:white;
                font-size:1.25rem;
                text-transform: capitalize;
            }
           .u-uname{
               color:grey;
              font-size:0.75rem;
              margin-top:-1rem;
           }
        }
        .ls-on{
            font-size:1rem;
            color:cornflowerblue; 
        }
        .ls-off{
            font-size:1.1rem;
            color:#2d466c;
        }
       

    }
    .ddl-menu{
           display:flex; 
           position:relative;
           button{
                 width:2rem;
                 background-color: transparent;
                 color:white;
                 font-size: 1.2rem;
                 outline: none;
                 border:none;

           }
           .opts{
             position: absolute;
             color:black;
             background-color:coral;
             font-size: 1rem;
             width:8rem;
             height:content;
             top:1.5rem;
             right:0rem;
             border-radius: 1rem;
            
                li{
                    list-style: none;
                    padding:1rem;
                    cursor: pointer;
                    &:hover{
                        background-color:cornflowerblue;
                        border-radius: 1rem;
                    }
                }
            
           }
        }
    .logout{
        button{
            font-family: "Josefin Sans",sans-serif;
            background:transparent;
            color:cornflowerblue;
            font-size:0.8rem;
            border:none;
            font-weight:bold;
            &:hover{
                font-size:1rem;
                color:coral;
            }
        }
    }
}
 .chat-messages{
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap:1rem;
  overflow: auto;
    &::-webkit-scrollbar{
        width:0.2rem;
        &-thumb{
            background-color: cornflowerblue;
            width:0.2rem;
            border-radius: 1.5rem;
        }
    }
    #msg-date{
           display: none;

           position:absolute;
           left:60%;
           color:black;
           background-color:rgba(255,255,255,0.5);
           border-radius:1rem;
           z-index:2;
           height:1.2rem;
           padding: 0.5rem;
     }
  div{
    position:relative;
    color:rgb(10,1,20);
    .msg-date{
        position:absolute;
        cursor: pointer;
        z-index:1;
        color:white;
        right:40%;
        bottom:75%;
        background-color:#1f2938;
        padding:.5rem;
        border-radius:.8rem;
    }
    .time{
        position:absolute;
        bottom:-7px;
        right:0;
        font-size:0.55rem;
        color:white;
     }
     .recv{
        left:0;
     }
     
    .message{
    display: flex;
    align-items: center;
    .content{
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        border-radius: 2rem;
        font-size: 1rem;
        color:rgb(10,1,20);//white;
    }
    
    .delete-msg{
        display: none;
        color:cornflowerblue;
        font-size:.9rem;
        transition: 0.3s ease-in-out;
        margin-right: 0.5rem;
        &:hover{
            color:coral;
            font-size:1.1rem;
        }
    }

  }
  .sended{
    justify-content:flex-end;
    .content{
        background-color:cornflowerblue;
    }
  }
  .recieved{
    justify-content:flex-start;
    .content{
        background-color:coral;
    }
  }
 }
}
`;
export default ChatContainer
