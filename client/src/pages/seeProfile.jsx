import React, { useEffect, useState } from "react";
import { NavLink, useLocation ,useNavigate} from "react-router-dom";
import styled from "styled-components";
import NoDP from '../assets/nodpp.jpg';
import {BsFillPersonFill} from 'react-icons/bs'
import {BiUserCircle} from 'react-icons/bi'
import {BsLink45Deg} from 'react-icons/bs';
import axios from "axios";
import { getFbroute, getUserDataRoute, sendFbRoute } from "../utils/ApiRoutes";
import {HiOutlineMail} from 'react-icons/hi';
import { toast,ToastContainer } from "react-toastify";
import {BiMessageDetail} from "react-icons/bi";

function SeeProfile()
{
    const [userData,setUserData]=useState();
    const location=useLocation();
   
        
   
    const currentUser=location.state.user;
    //const RefreshDp=location.state.dp;
   // const [userdp,setDp]=useState();


    const navigate=useNavigate();
    var uname;

    const [search_popup,setSearchPopup]=useState(false);
    const [search_popup2,setSearchPopup2]=useState(false);

    useEffect(()=>{
        if(currentUser){
            RefreshDP();
        }    
    },[])
    

    useEffect(()=>{
        if(!currentUser){
            navigate("/");
        }
    },[currentUser]);

    const BackHome = ()=>{
        navigate("/",{
            state:{
                ref:2
            }
        });
    }

    const RefreshDP = async ()=>{
        const newdp = await axios.post(getUserDataRoute,{
            uname:currentUser.username
        });

       setUserData(newdp.data[0]);

       // console.log("dp refrshed")
        
    }

   

    if(currentUser){
        uname=currentUser.name;
        uname=uname.charAt(0).toUpperCase() + uname.slice(1);
    }
    return(
        <>
          <Container>
            <nav className="prof-nav">
                <SendHelp popup={search_popup} setPopup={setSearchPopup} currentUser={currentUser} /> 
                <GetNotify popup={search_popup2} setPopup={setSearchPopup2} currentUser={currentUser}/>
                <div className="notific" onClick={()=> setSearchPopup2(true)}>
                     <BiMessageDetail/>
                </div>
               <div className="complain-box" onClick={()=> setSearchPopup(true)}>
                     Help
               </div>
               
                <div className="home-link" onClick={BackHome}>
                    <button>Home</button>
                </div>
                
            </nav>
          <div className="user-details">
                       <div className="profile-pic">
                        {
                            userData?(
                             userData.profilePic !== "" ? (
                                 <div>
                                  <img src={`data:image/svg+xml;base64,${userData.profilePic}`} alt="profilePic"/>
                                  <button onClick={()=>navigate("/setProfile",{state:{user:currentUser}})}>Change Profile Pic</button>
                                 </div>
                               
                            ):(
                                <div>
                                   <img src={NoDP} alt="no profile "/>
                                   <button onClick={()=>navigate("/setProfile",{state:{user:currentUser}})}>Set Profile Pic</button>
                                </div>
                            )):(
                                <div>
                                    <img src={NoDP} alt="no profile "/>
                                    <button>Loading ...</button>
                                </div>
                            )
                        } 
                       </div>
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
                                </>
                            ):"no"
                         }
   
                       </div>
                        
                       </div>
          </Container>
        </>
    )
}

function GetNotify({popup,setPopup,currentUser}){
 
    const [replys,setReplys]=useState();

    useEffect(()=>{

        getreply();

    },[]);

    const getreply = async ()=>{
      const dataa= await axios.post(getFbroute,{
        username:currentUser.username,
        toUser:currentUser.username,
        reply:true
      });

      if(dataa){
       // console.log(dataa.data);
        setReplys(dataa.data)
      }

    }
    const back=">"

    return(
        <>
        {
            popup?(
                <NotifyContainer>
                <button className="back-btn" onClick={()=> {setPopup(false);}}>back&nbsp;{back}</button>
                <div>
                {
                 replys?replys.map((index,fb)=>{
                                                
                    return(
                        <>
                        {
                            replys[fb].username === currentUser.username ?(
                                <div className="compbox">
                                    <p className="date-label">{replys[fb].date}</p>
                                    <div className="descrip">
                                        <p>Complain to :<span>{replys[fb].toUser}</span></p>
                                        <p>Description :<span>{replys[fb].description}</span></p>
                                        
                                    </div>
                            </div>
                            ):replys[fb].username === "admin-dochat-718" && replys[fb].toUser === currentUser.username?(
                                 <div className="compbox self">
                                    <div className="date-label">{replys[fb].date}</div><span style={{fontSize:".70rem",color:"coral",marginTop:".25rem"}}>Reply from Admin </span>
                                    <div className="descrip">
                                        
                                        <dialog open> Description : <span id="decin">{replys[fb].description}</span></dialog>
                                    </div>
                                     
                                 </div>
                            ):""
                        }
                        </>
                     
                    )
                }):"No Data"
               }
               </div>
            </NotifyContainer>
            ):""
        }
       </>
    )
}

function SendHelp({popup,setPopup,currentUser})
{

    const [description,setDescription]=useState("");
    const [toUser,setToUser]=useState("");

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
           const ress=await axios.post(sendFbRoute,{
            username:currentUser.username,
            toUser:toUser,
            description:description,
            date:fbdate
           });
           if(ress){
               //console.log(ress.data.msg)
                
               toast.success(ress.data.msg,toastOp);
               setDescription("");
               setToUser("");
           }
    }

    const back=">"
    return(
        <>
        {
            popup ? (
                <HelpContainer>
                   <button className="back-btn" onClick={()=> {setPopup(false);}}>back&nbsp;{back}</button> 
                   <div>
                       <label>Write about your suggetions or Complains</label>
                       <textarea placeholder="" value={description} onChange={(e)=> setDescription(e.target.value)}/>
                       <label>Write User's Username that you want to complain </label>
                       <input type="text" placeholder="Only feedback than don't write username here" value={toUser} onChange={(e)=> setToUser(e.target.value)}/>
                       <button onClick={sendfb}>Submit</button>
                   </div>
                </HelpContainer>
            ):""
        }
         <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black"}}></ToastContainer>
        </>
    )
}


const HelpContainer = styled.div`
    position: fixed;
    top:7rem;
    left:2rem;
    width:33.5%;
    height:75%;
    background-color:rgb(10,1,20);
    border:.1rem solid cornflowerblue;
    border-radius: .5rem;
    display: grid;
    //justify-content: center;
   // align-items: center;
    grid-template-rows: 10% 90%;
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

const NotifyContainer =styled.div`
    position: fixed;
    top:7rem;
    left:2rem;
    width:33.5%;
    height:75%;
    background-color:rgb(10,1,20);
    border:.1rem solid cornflowerblue;
    border-radius: .5rem;
    display: grid;
    grid-template-rows: 10% 90%;
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
                            padding:1rem;
                            overflow-y: scroll;
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
                                    margin-left: 4rem;
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
                                .date-label{
                                    position:absolute;
                                    right:.5rem;
                                    top:.3rem;
                                    font-size:.8rem;  
                                }
                                .descrip{
                                    height:5rem;
                                   dialog{
                                        color: cornflowerblue;
                                        font-size: 1rem;
                                        background-color:#1f2938;
                                        border:none;
                                        
                                        #decin{
                                            font-size:.85rem;
                                            color:white;
                                        }
                                   }
                                    
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
                    color:rgba(100,149,237,0.6);
                }
           }
        }
  }
`

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
  //gap: 3rem;
   height: 100vh;
   width: 100vw;
   color:white;

   .prof-nav{
    width:100%;
    height:5rem;
    display: grid;
    grid-template-columns: 5rem 2.5fr 0.5fr 0.5fr 0.5fr 5rem;
    margin-top:0rem;
    .notific{
        display: grid;
        grid-column: 3/4;
        font-size: 1.5rem;
        justify-content: start;
        align-items: center;
        //margin-top: 3rem;
        color:cornflowerblue;
        cursor: pointer;
        transition:.3s ease-in-out;
        &:hover{
            text-decoration: underline;
            font-size:1.75rem;
        }
    }
    .complain-box{
        display: grid;
        grid-column: 4/5;
        font-size: 1.5rem;
        justify-content: start;
        align-items: center;
        //margin-top: 3rem;
        color:cornflowerblue;
        cursor: pointer;
        
        &:hover{
            text-decoration: underline;
        }
    }
    .home-link{
        display: grid;
        grid-column: 5/6;
        font-size: 1.5rem;
        justify-content: start;
        align-items: center;
        button{
            border: none;
            outline: none;
            background-color: transparent;
            color:cornflowerblue;
            font-size: 1.6rem;
            transition: 0.5s;
            &:hover{
               // font-size: 1.8rem;
                color:rgba(100,149,237,0.8);
                text-decoration: underline;
            }
        }
    }
   }
   .user-details{
                    display: grid;
                    
                    align-items: center;
                    height:100vh;
                    grid-template-rows:.5rem 2fr 2fr 0.6rem 2rem;
                    overflow: hidden;
                    .profile-pic{
                        gap:2rem;
                        display: grid;
                        grid-row:2/3;
                        img{
                            height:5rem;
                            border-radius:50%;
                        }
                        div{
                            display: flex;
                            img{
                                height:5rem;
                                border-radius:50%;
                                /* &:hover{
                                    transform-origin: left;
                                    height:3.35rem;
                                    transition: 0.5s;
                                } */
                            }
                            button{
                                background-color:transparent;
                                color:cornflowerblue;
                                padding: 1rem 1rem;
                                border:none;
                                font-weight: bold;
                                cursor: pointer;
                                border-radius: 10px;
                                font-size: .8rem;
                                transition:0.3s ease-in-out;
                                &:hover{
                                    color:coral;
                                }
                            }
                        }
                    }
                    .username{
                        display: grid;
                        grid-row:3/4;
                        grid-template-rows:0rem 1fr 1fr 1fr 1fr 0rem;
                        margin-top: -3rem;
                        .u-name{
                            color:whitesmoke;
                            font-size:1.4rem;
                            transition: 0.5s;
                            display: grid;
                             grid-row:2/3;
                        }
                       .u-uname{
                           color:whitesmoke;
                          font-size:1.4rem;
                          display: grid;
                          grid-row:3/4;  
                          transition: 0.5s;                       
                       }
                       .u-email{
                          color:whitesmoke;
                          font-size:1.4rem;
                          display: grid;
                          grid-row:4/5;  
                          transition: 0.5s;         
                       }
                       .u-join{
                        transition: 0.5s;
                        color:whitesmoke;
                          font-size:1.4rem;
                          display: grid;
                          grid-row:5/6; 
                       }
                    }
                   
                }
`;

export default SeeProfile;