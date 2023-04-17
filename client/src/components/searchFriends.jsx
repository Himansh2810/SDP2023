import React, { useEffect } from 'react'
//import { useEffect } from 'react';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import NoDP from '../assets/nodpp.jpg';
import NotFoundGIF from '../assets/notfound.gif';
import { BiSearchAlt2} from 'react-icons/bi';
//import {GrGroup} from 'react-icons/gr';
import { addFriendsRoute, searchFriendsRoute } from '../utils/ApiRoutes';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function SearchPopup({popup,setPopup,currentUser,conloader})
{
    const [searchStr,setSearchStr]=useState("");
    const [result,setResult]=useState();
    const [xy,setXy]=useState(false);
    const toastOp={
        position:"bottom-right",
        autoClose:2000,
        pauseOnHover:true,
        draggable:true,
        closeOnClick: true,
    }

   
    const search_frnds=async (e)=>{

             if((searchStr.length === 1 && e.keyCode === 8) || (searchStr.length===0 && e.keyCode === 8) )
             {
                setResult([]);
                setXy(false);
             }
             else{
                const res=await axios.post(searchFriendsRoute,{
                    str:searchStr,
                    uid:currentUser._id,
                    onlydata:false
                });
               // console.log(res);
                if(res.data.length === 0)
                {
                     setXy(false);
                }
                else if(res && res.data.length > 0)
                {
                    setResult(res);
                    if(result)
                    {
                        setXy(true);
                    }
                }  
             }  
    }

    const handleSel=async (contact1)=>{

        const resp=await axios.post(addFriendsRoute,{
            user:[contact1.username,contact1.name,contact1.profilePic,contact1._id],
            me:[currentUser.username,currentUser.name,currentUser.profilePic,currentUser._id],
            post:true
        });

        if(resp)
        {
            conloader++;
            setSearchStr("");
            setXy(false);
            setResult([]);
            toast.success(`Successfully added @${contact1.username} to Your Daily Conversations 😉`,toastOp);
        }
    }
    const back=">"

    return (
         <>
           {
              popup ? (
                <Container>
                    <button className="back-btn" onClick={()=> {setPopup(false);setXy(false);setResult([]);conloader++}}>back&nbsp;{back}</button> 
                    <div className='inner'>
                        <div className='s-box'>
                            <BiSearchAlt2 id="search"/><input id="searchbar" autocomplete="off" placeholder="Search Freinds" autoFocus='true' value={searchStr} onChange={(e)=> setSearchStr(e.target.value)} onKeyDown={(e)=>search_frnds(e)}/>
                            
                        </div>
                        <div className='ress'>
                            {
                                xy? result.data.map((contact,index)=>{
                                    return (
                                        <div key={index} className="contact" >
                                            <div className='profile'>
                                                {
                                                    contact.profilePic !== "" ? (
                                                        <img src={`data:image/svg+xml;base64,${contact.profilePic}`} alt="profilePic"/>
                                                    ):(
                                                        <img src={NoDP} alt="no profile "/>
                                                    )
                                                }
                                                
                                            </div>
                                            <div className="username">
                                                <p className="u-name">{contact.name}</p>
                            
                                                <p className="u-uname"><span>@</span>{contact.username}</p> 
                                            </div>

                                            <div className='choose-chat' onClick={()=>handleSel(contact)}>
                                                 <p>Start Conversation </p>
                                            </div>
    
                                        </div>
                                    )
                                }) :(
                                    <div id="NotFound">
                                        {searchStr === ""?"":(<p><b>{searchStr}</b>&nbsp;Not Found !! </p>)}
                                         <img src={NotFoundGIF} alt="Not Found"/>
                                         
                                    </div>
                                )
                            }
                        </div>
                    </div>
                        
                  
                </Container>
              ):""
           }
        <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black"}}></ToastContainer>
         </>
    )
}

const Container = styled.div`
    position: fixed;
    top:5rem;
    left:3.8rem;
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
            #bck
            {
                 display: inline;
            }
          
    }
    .inner{
         display: flex;
         flex-direction: column;
         .s-box{
            margin-top: 1rem;
            display:flex;
            align-items:center;
            //justify-content:center;
            gap:1rem;
           
            #search{
                color:cornflowerblue;
                font-size: 1.5rem;
                margin-left: 1rem;
                &:hover{
                    cursor: pointer;
                }
            }
            #searchbar
            {
                color:white;//rgba(0,0,0, 0.95);
                background-color: transparent;// cornflowerblue;
                width:12rem;
                opacity: 1;
                height:1rem;
                border-radius: 10rem;
                font-size: 1.2rem;
                outline: none;
                font-weight: bold;
                border: none;
                //transition: opacity 1.5s , width 1.5s,margin-left 1.5s;
                &::placeholder {
                    font-size: 1rem;
                    opacity:0.9;
                    color:cornflowerblue;
                }
            }
         }
         .ress{
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: scroll;
            gap:0.8rem;
            &::-webkit-scrollbar{
                width:0.2rem;
                &-thumb{
                    background-color: cornflowerblue;
                    width:0.2rem;
                    border-radius: 1.5rem;
                }
            }
            #NotFound{
                img{
                    height:18rem;
                }
                p{
                    color:white;
                    text-transform: capitalize;
                    b{
                        color:coral;
                    }
                }
                
            }
            .contact{
                background-color: cornflowerblue;
                min-height: 3.4rem;
                width:80%;
                cursor: pointer;
                border-radius: 10rem;
                padding: 0.4rem;
                gap:1.2rem;
                align-items:center;
                display:grid;
                grid-template-columns: 15% 35% 50%;
                transition:0.3s ease-in-out;
                .profile{
                    img{
                        height:3.5rem;
                        border-radius:50%;
                    }
                }
                .username{
                .u-name{
                        color:white;
                        font-size:1.2rem;
                        transition: 0.5s;
                        &:hover{
                            transform-origin: left;
                        // color:rgba(100,149,237,0.7);
                            cursor: pointer;
                            transition: 0.5s;
                        }
                        }
                    .u-uname{
                        color:white;
                        font-size:0.75rem;
                        margin-top:-1.25rem;
                        span{
                            color:black;
                        }
                }
            }
            .choose-chat{
                
                 color:rgb(10,1,20);   
                 font-size:.75rem;
                 transition:0.4s ease-in-out;
                 right:0;
                  &:hover{
                       font-size: .8rem;
                       color:#eb4513;
                 } 
            }
        }
        }
    }
    
`

export default SearchPopup
