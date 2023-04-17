import React, { useCallback, useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate,NavLink,useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Contacts from '../components/contacts';
import { allUserRoute, host ,activeRoute,logoutRoute,statusRoute,getUserDataRoute,blockUserRoute} from '../utils/ApiRoutes';
import Welcome from '../components/welcome';
import ChatContainer from '../components/chatContainer';
import socketIO from "socket.io-client";
import NoDP from '../assets/nodpp.jpg';
import WebLogo from '../assets/weblogo.png';
import DpLoader from '../assets/Fidget-spinner.gif';

//import io from "socket.io-client";

function Chats()
{

    window.onbeforeunload = async function(e){
        let uStatus;
        if(sessionStorage.getItem("timepasser"))
        {
            uStatus = await updateLs(currentUser.username);
            
            e.returnValue =null
        }
        else{
            e.returnValue = null;
        }

         return null
       
      };
  
    const addOnline =async ()=>{

        if(currentUser)
        {
            const uStatus = await axios.post(statusRoute,{
                user:currentUser.username
            });
    
            if(uStatus)
            {
              //  console.log(uStatus.data);
            }
        }
        
    }

    const navigate=useNavigate();
   
    const [contacts,setContacts] = useState([]);
    const [currentUser,setCurrentUser] = useState(undefined);
    const [currentChat,setCurrentChat] = useState(undefined);
    const [isLoaded,setLoaded]=useState(false);
    const [isContactLoaded,setContactLoaded]=useState(false);
    
    const [userdp,setDp]=useState();

    useEffect(()=>{

        async function load()
        {
            if(!sessionStorage.getItem("timepasser"))
            {
                navigate("/login");
            }else{
               
                setCurrentUser(await JSON.parse(sessionStorage.getItem("timepasser")));
                setLoaded(true);
            }
        }
        load();
        
    },[]);

    useEffect(()=>{
        addOnline();
     },[currentUser])

    const [sid,setSid]=useState("");
    const [onlineUsers,setOnlineUsers]=useState();

    const updateLs = async (usern)=>{

        const uStatus = await axios.post(logoutRoute,{
                    user:usern
        });

        if(uStatus)
        {
           // console.log(uStatus)

            return true  
        }

        return true
    }

    ///var socket;
    const socket =socketIO(host,{transports:['websocket']});
   
    useEffect(()=>{
   
         if(currentUser) {
            socket.on("connect",()=>{
                //console.log("connected");
                setSid(socket.id);
            });
            socket.emit('user-joined',{data:currentUser.username})

            socket.on('welcome',(data)=>{
               // console.log(data)
           })
 
           socket.on("userOnline",(data)=>{
           
            let onusrs=[];
              for(let k=0;k<data.length;k++){
                   onusrs.push({[data[k].userId]:true})
              }
              setOnlineUsers(onusrs);
           })

           socket.on("userOffline",(data)=>{
            
             let onusrs=[];
              for(let k=0;k<data.length;k++){
                   onusrs.push({[data[k].userId]:true})
              }
              setOnlineUsers(onusrs);

           })
      
        };

         
          return ()=>{
                 socket.disconnect();
                 socket.off();
          }

    },[currentUser]);

     useEffect(()=>{
        async function func (){
               if(currentUser){
                   const data=await axios.get(`${allUserRoute}/${currentUser._id}`);
                   //console.log(data.data)
                   setContacts(data.data);

                  // console.log("renders....")
                   
                  // setDp({set:true,pic:currentUser.profilePic});
               }
        }

        func();
        
     },[currentUser]);//refrshdp

     const[dprf,setdprf]=useState(0);

     useEffect(()=>{

         async function fnc()
         {
               const newdp = await axios.post(getUserDataRoute,{
                uname:currentUser.username
               });
    
               if(newdp)
               {
                 setDp(newdp.data[0].profilePic);
               }
         }

         if(currentUser)
         {
            fnc();
         }

     },[dprf]);//refrshdp

    
   useEffect(()=>{
    if(currentChat){
        if(newMsg.to === currentChat.username)
        {
          setNewMsg({new:false,to:""});
        }
    }
        
   },[currentChat])


     const handleChatChange=(chat) =>{
               setCurrentChat(chat);
               setContactLoaded(true);

     }
   
     const logout=async ()=>{
        if(window.confirm("Are you sure want to logout ?"))
        {
            const uStatus = await updateLs(currentUser.username);
            if(uStatus)
            {
                sessionStorage.removeItem("timepasser");
                navigate("/login");  
            }
        }  
    }

    const seeProfile = ()=>{
        navigate("/seeProfile",{
            state:{
                user:currentUser,
            }
        });
    }
    var uname;

    if(currentUser){
        uname=currentUser.name;
      

        if(uname.includes(" ")){
            uname=uname.split(' ').slice(0,-1).join('');
        }
        else{
            uname=uname.charAt(0).toUpperCase() + uname.slice(1);
        }
          
    }

    //var uname=currentChat.name;
    //uname=uname.charAt(0).toUpperCase() + uname.slice(1);

    const [blockedUsers,setBlockedUsers]=useState([]);
    const [loadBlk,setLoadblk]=useState(false);

    useEffect(()=>{

        async function loadd(){
            const resp2=await axios.post(blockUserRoute,{
                me:currentUser.username,
                usern:"",
                post:false
            });
    
            const blkusr=resp2.data[0].blockedUsers;
    
            setBlockedUsers(blkusr);
            setLoadblk(true);

        }
       
        if(currentUser){
            loadd();
            
        }
    },[currentUser]);

    useEffect(()=>{
        
        const timer = setTimeout(()=>{
            let rf=dprf+1;
            setdprf(rf);
           // console.log("after 2 s")
        },1500);
        return () => clearTimeout(timer);
    },[])


    const [newMsg,setNewMsg]=useState({new:false,to:"",msg:""});



    return(
        <>
        <Container>
            <nav className='chat-nav'>
                <div className="logo">
                      <img src={WebLogo} alt="DoChat"/>
                </div>
                <div className="links">
                <ul>
                    <li>
                    <div className="user-details" onClick={seeProfile}>
                       <div className="profile-pic">
                        {
                            currentUser?(
                             userdp && currentUser.profilePic !=="" ? ( 
                                <img src={`data:image/svg+xml;base64,${userdp}`} id="set"  alt="profilePic"  onClick={seeProfile}/>     
                            ):(
                                <img src={userdp?`data:image/svg+xml;base64,${userdp}`:DpLoader} id="set"  alt="no profile" onClick={seeProfile}/>  
                            )):<img src={NoDP}   alt="no profile "/>
                        } 
                       </div>
                       <div className="username">
                         {
                            currentUser?(
                                <>
                                    <p className="u-name">{currentUser.name}</p>
                                    <p className="u-uname"><span>@</span>{currentUser.username}</p> 
                                </>
                            ):"no"
                         }
   
                       </div>
                       </div>
                    </li>
                    <li>
                       <button onClick={logout}>Logout</button>
                    </li>
                </ul>
                </div>
            </nav>
            <div className='container'>
                {
                    loadBlk?(
                        <Contacts setBlockedUsers={setBlockedUsers} newMsg={newMsg} blockedUsers={blockedUsers} contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
                    ):<p style={{color:"white"}}>Loading ...</p>
                }
                {
                    !isContactLoaded && isLoaded && currentChat === undefined ?(
                        <Welcome currentUser={currentUser}/>
                    ):(
                        isContactLoaded ?(
                           <ChatContainer setNewMsg={setNewMsg} setBlockedUsers={setBlockedUsers} setContactLoaded={setContactLoaded} currentChat={currentChat} currentUser={currentUser} socket={socket} sid={sid} onlineUsers={onlineUsers}/>
                        ):(
                           ""
                        )
                    )
                }
               
            </div>
            <footer>

            </footer>
            
        </Container>
        </>
       
    )
}

const Container =styled.div`
height: 93vh;
width:95vw;
display: flex;
flex-direction: column;
justify-content: center;
gap:1rem;
align-items: center;
background-color: rgb(10,1,20);
grid-template-rows: 0 1fr 10fr 0;
.chat-nav{
    width:100%;
    grid-row: 2/3;
    height:7rem;
    display: grid;
    grid-template-columns: 5rem 1fr 0.6fr 5rem;
    margin-top:0rem;
    transition:0.5s;
    .logo{
        display: grid;
        grid-column: 2/3;
        font-size: 1.5rem;
        justify-content: start;
        align-items: center;
        color:cornflowerblue;
        img{
            height:3rem;
        }
    }
    .links{
        grid-column:3/4;
        background-color:rgba(255,255,255,0.0);
        border-radius:18rem;
        ul{
            height:10rem;
            display: flex;
            justify-content: space-around;
            align-items: center;
            list-style-type: none;
            li{
                font-size: 1.5rem;
                list-style: none;
                color:cornflowerblue;
                button{
                    text-transform: capitalize;
                    text-decoration:none;
                    color:cornflowerblue;
                    transition: 0.5s;
                    border:none;
                    background-color:transparent;
                    font-size:1.25rem;
                    &:hover{
                        transform-origin: left;
                        color:coral;
                        font-size:1.5rem;
                        transition: 0.5s;
                        cursor: pointer;
                    }
                }
                .user-details{
                    display: flex;
                    gap:1rem;
                    align-items: center;
                   #refresh{
                     cursor:pointer;

                   }
                    .profile-pic{
                        position: relative;
                        img{
                            height:2.75rem;
                            border-radius:50%;
                        }
                        #set{
                            &:hover{
                                transform-origin: left;
                                height:3.35rem;
                                transition: 0.5s;
                                border:4px solid cornflowerblue;
                                cursor: pointer;
                            }
                        }
                       
                    }
                    
                    .username{
                        .u-name{
                            color:cornflowerblue;
                            font-size:1.35rem;
                            transition: 0.5s;
                            text-transform: capitalize;
                            &:hover{
                                transform-origin: left;
                               // color:rgba(100,149,237,0.7);
                                cursor: pointer;
                                transition: 0.5s;
                            }
                        }
                       .u-uname{
                           color:rgb(180,180,180);
                          font-size:0.75rem;
                          margin-top:-1.25rem;
                          span{
                            color:cornflowerblue;
                          }
                          &:hover{
                            transform-origin: left;
                            font-size:1rem;
                            transition: 0.5s;
                            cursor: pointer;
                        }
                       }
                    }
                }
            }
        }
    }
    
}
.container{
    grid-row: 3/4;
    height:90%;
    width:90%;
    background-color:rgb(10,1,20); //rgb(6,6,50);
    display: grid;
    grid-template-columns:40% 60%;
    @media screen and (min-width:720px) and (max-width:1080px) {
        grid-template-columns: 35% 65%;    
    }
    button{
        width:4rem;
        height:2rem;
    }
}
`

export default Chats