import React, { useEffect, useState } from "react";
import { NavLink, useLocation ,useNavigate} from "react-router-dom";
import styled from "styled-components";
import NoDP from '../assets/nodpp.jpg';
import {BsFillPersonFill} from 'react-icons/bs'
import {BiUserCircle} from 'react-icons/bi'
import {BsLink45Deg} from 'react-icons/bs';
import axios from "axios";
import { deleteUserRoute, getFbroute, getUserDataRoute ,getAllUsersRoute,sendFbRoute,logoutRoute} from "../utils/ApiRoutes";
import {HiOutlineMail} from 'react-icons/hi';
import {BiDotsVerticalRounded} from "react-icons/bi";
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {RiRadioButtonLine} from "react-icons/ri";

function AdminSeeProfile({setCurrentSelected,currentUser, setAllUsers})
{
   // const [userData,setUserData]=useState();
    
    //const RefreshDp=location.state.dp;
    const [userfb,setUserfb]=useState();


   // const navigate=useNavigate();
    var uname;

    useEffect(()=>{
        if(currentUser)
        {
            getfb();
            getLs();
           // console.log("calld")
        }
         
    },[currentUser])
   
    const getfb=async()=>{
        const rss=await axios.post(getFbroute,{
            username:currentUser.username
        });

        if(rss)
        {
          //  console.log(rss.data);
            setUserfb(rss.data);
            if(userfb){
                // console
                // .log(userfb)
            }
        }
    }
    
    const[userActiveStatus,setActiveStatus]=useState({});

    const getLs = async ()=>{
        const uStatus = await axios.post(logoutRoute,{
            user:currentUser.username,
            get:true
        });

        if(uStatus)
        {
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
                last_seen = ccc
            }
            else if(Msgdate === ccc.slice(0,5)){
                last_seen = "Active today at "+ccc.slice(10);
            }
            else if( parseInt(dd) === parseInt(ccc.slice(0,2))+1){
                last_seen ="Active yesterday at"+ccc.slice(10);
            }
            else{
                last_seen ="Active on "+ccc.slice(0,2)+" "+monthNames[parseInt(ccc.slice(3,5))-1];
            }
 
          
            setActiveStatus(prev => ({
                ...prev,
                [currentUser.username]:last_seen
            }));

        }

    }

    const [showDdl,setShowDdl]=useState(false);

    const openDdl = ()=>{

        
         if(!showDdl)
         {
            setShowDdl(true);
           
         }
         else{
          
            setShowDdl(false);
         }
    }

    const removeUser=async()=>{

        if(window.confirm("Are you sure Remove this User ? "))
        {

            const rsss=await axios.post(deleteUserRoute,{
                verify:"admin-dochat",
                usern:currentUser.username
            });
            
            if(rsss){
                const udata=await axios.post(getAllUsersRoute,{
                    verify:"admin-dochat"
                });
                
                if(udata)
                {
                    setCurrentSelected({});
                    setAllUsers(udata.data);
                    setShowDdl(false);
                }
            }
        }
    }

    const [search_popup,setSearchPopup]=useState(false);


   

    if(currentUser){
        uname=currentUser.name;
        uname=uname.charAt(0).toUpperCase() + uname.slice(1);
    }
    return(
        <>
          <Container>
            <nav className="prof-nav">
                <div className="home-link">
                    <span>User Details</span>
                </div>
                <div className={`ddl-menu ${showDdl?"show":""}`} >
                            <button onClick={openDdl}><BiDotsVerticalRounded/></button>
                            {
                                 showDdl?(
                                    <div className="opts">
                                        <li onClick={removeUser}>Remove User</li>
                                        <li onClick={()=>{ setSearchPopup(true);openDdl();}}>Warn/Reply User</li>
                                    </div>
                                 ):""
                            }
                    </div>
            </nav>
          <div className="user-details">
                       <div className="profile-pic">
                        {
                            currentUser?(
                             currentUser.profilePic !== "" ? (
                            
                                <img src={`data:image/svg+xml;base64,${currentUser.profilePic}`} alt="profilePic"/>
                            ):(
                                <img src={NoDP} alt="no profile "/>
                            )):<img src={NoDP} alt="no profile "/>
                        } 
                       </div>
                       <SendReply popup={search_popup} setPopup={setSearchPopup} currentUser={currentUser} />
                       <div className="username">
                         {
                            currentUser?(
                                <>
                                    
                                    <p className="u-name">
                                        <UserDet>
                                            <span>
                                            <BiUserCircle className="user-icon"/>&nbsp;<span>Username :&nbsp; <span>{currentUser.username}</span> </span>
                                            </span> 
                                        </UserDet> 
                                    </p>
                                    <p className="u-uname">
                                        <UserDet>
                                            <span>
                                            <BsFillPersonFill className="user-icon"/>&nbsp;<span>Name :&nbsp; <span>{uname}</span></span>
                                            </span>
                                        </UserDet>
                                    </p> 
                                    <p className="u-email">
                                        <UserDet>
                                            <span>
                                            <HiOutlineMail className="user-icon"/>&nbsp;<span>Email :&nbsp; <span>{currentUser.email}</span></span>
                                            </span>
                                        </UserDet>
                                    </p> 
                                    <p className="u-join">
                                        <UserDet>
                                            <span>
                                                <BsLink45Deg className="user-icon" />&nbsp;<span>Joined :&nbsp;<span>{currentUser.joinedOn}</span></span>
                                            </span>
                                        </UserDet>
                                    </p>
                                    <p className="u-sts">
                                       <UserDet>
                                            <span>
                                                <RiRadioButtonLine className="user-icon" />&nbsp;<span>Active Status :&nbsp;<span>{userActiveStatus[currentUser.username]}</span></span>
                                            </span>
                                        </UserDet>
                                    </p>
                                    
                                </>
                            ):""
                         }
   
                       </div>
                       <div className="u-fb">

                        <p>Feedback & Complains </p>
                                        {
                                            
                                            userfb?userfb.map((index,fb)=>{
                                                
                                                return(
                                                    <>
                                                    {
                                                        userfb[fb].username === currentUser.username ?(
                                                            <div className="compbox">
                                                                <p className="date-label">{userfb[fb].date}</p>
                                                                <div className="descrip">
                                                                    <p>Complain to :<span>{userfb[fb].toUser}</span></p>
                                                                    <p>Description :<span>{userfb[fb].description}</span></p>
                                                                    
                                                                </div>
                                                        </div>
                                                        ):userfb[fb].username === "admin-dochat-718" && userfb[fb].toUser === currentUser.username?(
                                                             <div className="compbox self">
                                                                <div className="date-label">{userfb[fb].date}</div>
                                                                <div className="descrip">
                                                                    <p>Reply to :<span>{userfb[fb].toUser}</span></p>
                                                                    <p>Description :<span>{userfb[fb].description}</span></p>
                                                                    
                                                                </div>
                                                             </div>
                                                        ):"No Data"
                                                    }
                                                    </>
                                                 
                                                )
                                            }):"No Data"
                                        }
                                    </div>
                       
                       </div>
          </Container>
        </>
    )
}

function SendReply({popup,setPopup,currentUser})
{

    const [description,setDescription]=useState("");
    //const [toUser,setToUser]=useState("");

    const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
               
     const today=new Date();
     const day= String(today.getDate()).padStart(2, '0');
     const cr_time = today.toLocaleTimeString('en-US', { hour12: true });
     const fbdate=day+" "+monthNames[today.getMonth()]+" "+today.getFullYear()+" "+cr_time;
    
     

    const toastOp={
        position:"bottom-right",
        autoClose:2000,
        pauseOnHover:true,
        draggable:true,
        closeOnClick: true,
    }

    const sendfb=async ()=>{
        if(description !== "")
        {
           const ress=await axios.post(sendFbRoute,{
            username:"admin-dochat-718",
            toUser:currentUser.username,
            description:description,
            date:fbdate
           });
           if(ress){
               toast.success("Successfully reply to User",toastOp);
               setDescription("");
           }
        }
        else{
            toast.error("Please fill all fields",toastOp)
        }
    }

    const back=">"
    return(
        <>
        {
            popup ? (
                <ReplyContainer>
                   <button className="back-btn" onClick={()=> {setPopup(false);}}>back&nbsp;{back}</button> 
                   <div>
                       <label>Write your replyes or Warnings</label>
                       <textarea placeholder="" value={description} onChange={(e)=> setDescription(e.target.value)}/>
                       <label>Write User's Username that you want to reply </label>
                       <input type="text" placeholder="if Only annoncemnet than don't write username here" value={currentUser.username} readOnly/>
                       <button onClick={sendfb}>Submit</button>
                   </div>
                </ReplyContainer>
            ):""
        }
         <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black"}}></ToastContainer>
        </>
    )
}


const ReplyContainer = styled.div`
    position:fixed;
    top:5rem;
    left:38%;
    z-index:1;
    display:flex;
    flex-direction:column;
    background-color:rgb(10,1,20);
    color:white;
    border:1px solid cornflowerblue;
    border-radius:.5rem;
    width:60%;
    height:80%;
    .back-btn{
            display: flex;
            flex-direction: column;
            justify-self: flex-end;
            text-transform: capitalize;
            margin-right: 1rem;
            margin-top:.8rem;
            text-decoration:none;
            color:cornflowerblue;
            transition: 0.3s;
            border:none;
            background-color:transparent;
            font-size:1.25rem;
            &:hover{        
                color:coral;
                transition: 0.3s;
                cursor: pointer;
            }
    }
    div{
        display: flex;
        flex-direction: column;
        gap:2rem;
        margin-top: 2rem;
        justify-content: center;
        align-items: center;
        input{
            color:white;
            outline:none;
            background-color: transparent;
            padding: 1rem;
            border: 1px solid cornflowerblue;
            border-radius:12px;
            font-size:1rem;
            width:70%;
        }
        textarea{
            color:white;
            outline:none;
            background-color: transparent;
            padding: 1rem;
            border: 1px solid cornflowerblue;
            border-radius:12px;
            font-size:1rem;
            width:70%;
            resize: vertical;  
        }
        label{
            color:cornflowerblue;
            font-size: 1rem;   
        }
        button{
                         display: grid;
                        grid-row: 4/5;
                        width:60%;
                        background-color: cornflowerblue;
                        color:black;
                        padding: 1rem 2rem;
                        border:none;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 10px;
                        font-size: 1rem;
                        transition:0.2s ease-in-out;
                        &:hover{
                            background-color:rgb(64, 108, 190);
                        }
        }
    }
`

const UserDet =styled.div`
    span{
         display: flex;
         .user-icon{
             color:cornflowerblue;
            font-size: 1.8rem;
         }
        span{
          margin-top: 0.35rem;
          span{
                color:cornflowerblue;
                margin-top: -0rem;
                &:hover{
                    color:rgba(100,149,237,0.75);
                }
           }
        }
  }
`

const Container = styled.div`
   display: flex;
//justify-content: center;
  // align-items: center;
   flex-direction: column;
  //gap: 3rem;
   height: 90vh;
   width: 100vw;
   color:white;

   .prof-nav{
    width:50%;
    height:5rem;
    display: grid;
    grid-template-columns: 2rem 1fr 1fr 2rem;
    margin-top:0rem;
    .home-link{
        display: grid;
        grid-column: 2/3;
        font-size: 1.5rem;
        justify-content: start;
        align-items: center;
        span{
            color:cornflowerblue;
        }
    }
    .ddl-menu{
           display:flex; 
           grid-column:3/4;
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
             z-index:1;
             color:black;
             background-color:coral;
             font-size: 1rem;
             width:10rem;
             height:content;
             top:2.5rem;
             right:50%;
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
   }
   .user-details{
                    display: grid;
                    margin-left: 5rem;
                    align-items: center;
                    height:100vh;
                    grid-template-rows:.5rem 2.5fr 2fr 1fr 2rem;
                    overflow: hidden;
                    .profile-pic{
                        gap:2rem;
                        display: grid;
                        grid-row:2/3;
                        img{
                            height:5rem;
                            border-radius:50%;
                            /* &:hover{
                                transform-origin: left;
                                height:3.35rem;
                                transition: 0.5s;
                            } */
                        }
                    }
                    .username{
                        display: grid;
                        grid-row:3/4;
                        grid-template-rows:0rem 1fr 1fr 1fr 1fr 1fr 0rem;
                        margin-top: 0rem;
                        transition: 0.5s;
                        color:whitesmoke;
                        
                        .u-name{
                            display: grid;
                             grid-row:2/3;
                             font-size:1.2rem;
                        }
                       .u-uname{
                          display: grid;
                          grid-row:3/4; 
                          font-size:1.2rem;                      
                       }
                       .u-email{
                          display: grid;
                          grid-row:4/5;    
                          font-size:1.2rem;      
                       }
                       .u-join{
                          display: grid;
                          grid-row:5/6; 
                          font-size:1.2rem;
                       }
                       .u-sts{
                        display:grid;
                        grid-row:6/7;
                       }
                      
                    }
                    .u-fb{
                            position: fixed;
                            top:5.5rem;
                            right:2rem;
                            width:30%;
                            height:75%;
                            background-color:rgb(10,1,20);
                            border-left:.1rem solid cornflowerblue;
                            overflow-y: scroll;
                            p{
                                margin-left: 20%;
                                font-size: 1.2rem;
                                color:cornflowerblue;
                              
                            }
                            &::-webkit-scrollbar{
                                width:0.2rem;
                                &-thumb{
                                    background-color: cornflowerblue;
                                    width:0.2rem;
                                    border-radius: 1.5rem;
                                }
                            }
                            .compbox{
                                .date-label{
                                font-size: 1rem;
                                color:coral;
                                margin-left: 1rem;
                              }
                              .descrip{
                                    margin-left: 0rem;
                                    p{
                                        color: cornflowerblue;
                                        font-size: 1rem;
                                        span{
                                            color:white;
                                            font-size:0.85rem;
                                        }
                                    }
                                }
                            }
                            .self{
                                background-color:#1f2938;
                                border-radius:.5rem;
                                display:grid;
                                grid-template-rows: 10% 90%;
                                position:relative;
                                padding:.5rem;
                                .date-label{
                                    position:absolute;
                                    right:.5rem;
                                    top:.5rem;
                                    font-size:.8rem;
                                    
                                }
                                .descrip{
                                    margin-top:.8rem;
                                }
                            }
                           
                    } 
                    button{
                        display: grid;
                        grid-row: 4/5;
                    }
                }
`;

export default AdminSeeProfile;