import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllUsersRoute } from "../utils/ApiRoutes";
import styled from "styled-components";
import NoDP from '../assets/nodpp.jpg';
import AdminSeeProfile from "./adminSeeprofile";
import {FaUserFriends} from 'react-icons/fa';

function Admin()
{
    const navigate=useNavigate();

    const[allUsers,setAllUsers]=useState();
  useEffect(()=>{
     if(!sessionStorage.getItem("admin-dochat-28211")){
        navigate("/adminLogin");
     }
  },[]);

  useEffect(()=>{
     async function loadd(){
        const udata=await axios.post(getAllUsersRoute,{
            verify:"admin-dochat"
        });

        if(udata)
        {
            //console.log("yessssss")
            //console.log(udata.data);
            setAllUsers(udata.data);
        }
       
        
        
     }

     loadd();
  },[])

  const logout =()=>{
    if(window.confirm("Are you sure want to Logout ?")){
        sessionStorage.clear();
        navigate("/adminLogin");
    }
      
  }

  const [currentSelected,setCurrentSelected]=useState()

  const seeProf =(index,user)=>{
       setCurrentSelected({index,user});
  }

  return(
     <>
    <NAV>
        <div className="home-link">
            DoChat-Admin
        </div>
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    </NAV>
    <Container>
        
        <div className="users">
            <div className="user-det"><FaUserFriends/>&nbsp;&nbsp;<span>DoChat Users</span></div>
        {
            allUsers? (

                allUsers.map((user,index) => {
                    return (
                        <div key={index} className={`user ${index === (currentSelected?currentSelected.index:"") ? "selected":""}`} onClick={()=> seeProf(index,user)}>
                            <div className='profile'>
                                {
                                   
                                    user.profilePic !== "" ? (
                                        <img src={`data:image/svg+xml;base64,${user.profilePic}`} alt="profilePic"/>
                                    ):(
                                        <img src={NoDP} alt="no profile "/>
                                    )
                                }
                                
                            </div>
                            <div className="username">
                                <p className="u-name">{user.name}</p>
                                <p className="u-uname"><span>@</span>{user.username}</p> 
                            </div>

                        </div>
                    )
                 }
                )
             
            ):("Not found")
        }
     </div>
     <div className="user-info">
        <AdminSeeProfile setCurrentSelected={setCurrentSelected} setAllUsers={setAllUsers} currentUser={currentSelected?currentSelected.user:""}></AdminSeeProfile>
     </div>
    </Container>
    </>
  )
}



const NAV=styled.nav`
    width:100%;
    height:5rem;
    display: grid;
    grid-template-columns: 5rem 1fr 1fr 5rem;
    margin-top:0rem;
    color:cornflowerblue;
    .home-link{
        display: grid;
        grid-column: 2/3;
        font-size: 1.8rem;
        justify-content: start;
        align-items: center;
    }
    div{
        display: grid;
        grid-column: 3/4;
        button{
            display: flex;
            flex-direction: column;
            justify-self: flex-end;
            text-transform: capitalize;
            margin-right: 1rem;
            margin-top:1.2rem;
            text-decoration:none;
            color:cornflowerblue;
            transition: 0.3s;
            border:none;
            background-color:transparent;
            font-size:1.4rem;
            &:hover{
                
                color:coral;
                transition: 0.3s;
                cursor: pointer;
            }
        }
    }
`

const Container=styled.div`
    height:90%;
    width:90%;
    background-color:rgb(10,1,20); //rgb(6,6,50);
    display: grid;
    grid-template-columns:40% 60%;
    
    .users{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    gap:0.8rem;
    height: 90%;
       .user-det{
            color:cornflowerblue;
            display:flex;
            span{
               
            }
        }
    &::-webkit-scrollbar{
        width:0.2rem;
        &-thumb{
            background-color: cornflowerblue;
            width:0.2rem;
            border-radius: 1.5rem;
        }
    }
    .user{
       background-color: cornflowerblue;
       min-height: 3.75rem;
       width:80%;
       cursor: pointer;
        border-radius: 10rem;
        padding: 0.4rem;
        gap:1.5rem;
        align-items:center;
        display:flex;
        transition:0.3s ease-in-out;
       
        .profile{
            img{
                height:3.5rem;
                border-radius:50%;
            }
        }
        .username{
                       .u-name{
                            color:rgb(10,1,20);
                            font-size:1.2rem;
                            transition: 0.5s;
                            &:hover{
                                cursor: pointer;
                                transition: 0.5s;
                            }
                        }
                       .u-uname{
                           color:rgb(200,200,200);
                          font-size:0.75rem;
                          margin-top:-1.25rem;
                          span{
                            color:rgb(50,50,50);
                          }
                          &:hover{
                            color: white;
                            transition: 0.5s;
                            cursor: pointer;
                        }
                       }
        }
    }
    .selected{
        background-color:coral;
    }
  }
  .user-info{
    justify-content: center;
  }
`

export default Admin