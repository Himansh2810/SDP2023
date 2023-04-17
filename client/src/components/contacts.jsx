import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import NoDP from '../assets/nodpp.jpg';
import { BiSearchAlt2} from 'react-icons/bi';
import {FaUserFriends} from 'react-icons/fa';
import SearchPopup from './searchFriends';
import { addFriendsRoute ,searchFriendsRoute, unblockUserRoute,blockUserRoute} from '../utils/ApiRoutes';
import {BiPencil} from 'react-icons/bi';
import {TbMessageCircle} from 'react-icons/tb';


function Contacts({setBlockedUsers,currentUser,changeChat,blockedUsers,newMsg})
{
    const [currentUserName,setCurrentUserName] = useState(undefined);
    const [currentSelected,setCurrenrtSelected] = useState(undefined);
    const [search_popup,setSearchPopup]=useState(false);
    const [currentChats,setCurrentChats]=useState([]);
   

    useEffect(() => {
        
        if(currentUser)
        {
            setCurrentUserName(currentUser.name);
        }
         
    },[currentUser]);

    var contact_loader=0;
    const[isCntLoading,setCntLoad]=useState(true);

    useEffect(()=>{
        async function loadd(){
              const cnt = await axios.post(addFriendsRoute,{
                user:[],
                me:currentUser.username,
                post:false
              });

              const cnts=cnt.data[0].selectedChats;
              let finaldata=[];

              for(var k=0;k<cnts.length;k++)
              {
                const res=await axios.post(searchFriendsRoute,{
                    str:'',
                    uid:cnts[k][0],
                    onlydata:true
                });

                if(res.data[0] !== undefined)
                {
                    finaldata.push(res);
                }
              //  console.log(res.data[0])
                
              }

              //console.log(finaldata);
               
              setCurrentChats(finaldata);
              setCntLoad(false);



              //console.log(cnt.data[0]);
        }

        if(currentUser){
            loadd();
        }
        
    },[currentUser,contact_loader,search_popup]);

    const changeCurrentChat = async (index,contact) => {
       
       changeChat(contact);
       setCurrenrtSelected(index);
        

       document.getElementById("searchbar").style.opacity=0;
       document.getElementById("searchbar").style.width="0rem";
       document.getElementById("searchbar").style.marginLeft="0rem";
       setSearchBox(true);
       setSearch("");
        let x=document.getElementsByClassName("contact");
        for (var i = 0; i < x.length; i++) { 
              x[i].style.display="flex";           
        }
      
    }

    // const[chatIndex,setChatIndex]=useState();

    const changeChatOrder =async (index)=>{

        var arr=currentChats;
        const fromIndex =index;
    
        const element = arr.splice(fromIndex, 1)[0];
        arr.splice(0, 0, element);
        setCurrentChats(arr);
        
        const cnt = await axios.post(addFriendsRoute,{
            user:[],
            me:currentUser.username,
            post:false
          });

          let cnts=cnt.data[0].selectedChats;
          const element2 = cnts.splice(fromIndex, 1)[0];
          cnts.splice(0, 0, element2);

            const chngord = await axios.post(addFriendsRoute,{
                me:currentUser.username,
                nUsers:cnts,
                pos:true
            });
    }

    const [searchStr,setSearch]=useState("");
    const [searchBoxOpen,setSearchBox]=useState(true);
   
    const search_frnds=() => {

      let x=document.getElementsByClassName("contact");

      for (var i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(searchStr)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="flex";           
        }
      }
    }

    const open_search =()=>{
        
        document.getElementById("searchbar").focus();//autofocus = true;
        if(searchBoxOpen)
        {
        // document.getElementById("searchbar").style.display="inline";
            document.getElementById("searchbar").style.opacity=1;
            document.getElementById("searchbar").style.width="12rem";
            document.getElementById("searchbar").style.marginLeft="3rem";
            setSearchBox(false);
        }
        else{
            document.getElementById("searchbar").style.opacity=0;
            document.getElementById("searchbar").style.width="0rem";
            document.getElementById("searchbar").style.marginLeft="0rem";
            setSearchBox(true);
        }
    }

    const FunUnblockUser = async (usern)=>{
         const dataa=await axios.post(unblockUserRoute,{
            me:currentUser.username,
            usern:usern
         });

         if(dataa)
         {
            const resp2=await axios.post(blockUserRoute,{
                me:currentUser.username,
                usern:usern,
                post:false
            });

            let blkusr=resp2.data[0].blockedUsers;

            setBlockedUsers(blkusr);
         }
    }

    useEffect(()=>{
         if(newMsg){
           const indek=currentChats.findIndex(chats => chats.data[0].username === newMsg.to);
           if(indek !== -1)
           {
            if(indek === currentSelected)
            {
                setCurrenrtSelected(0);
            }
            else if(indek > currentSelected) {
                setCurrenrtSelected(currentSelected+1);
            }

            changeChatOrder(indek);
            
           }
         
         }
    },[newMsg])

   

    return(
         <>
         {

               currentUserName && (
                <Container>
                    <div className='brand'>
                        <input id="searchbar" placeholder="Search Freinds" value={searchStr} onChange={(e)=> setSearch(e.target.value)}  onKeyDown={search_frnds}/><BiSearchAlt2 id="search" onClick={open_search}/>
                    </div>
                    <div className="contacts">
                        {
                           !isCntLoading ? currentChats && currentChats.map((contact,index) => {

                                 let soBlocked = true;
                                 let whoBlocked=[];

                                 if(contact.data[0] === {})
                                 {
                                    soBlocked =false;
                                 }

                                 for(var h=0;h<blockedUsers.length;h++)
                                 {
                                    whoBlocked=blockedUsers[h].split("-");
                                    if(whoBlocked[1] === contact.data[0].username || whoBlocked[0] === contact.data[0].username )
                                    {
                                         soBlocked = false ;
                                    }
                                 }
                                //console.log(contact.data[0].name);
                                return (<>
                                  { 
                                     soBlocked ? (
                                        <div key={index} onClick={()=>changeCurrentChat(index,contact.data[0])} className={`contact ${
                                            index === currentSelected ? "selected":""
                                        }`} >
                                            <div className='profile'>
                                                {
                                                   
                                                    contact.data[0].profilePic !== "" ? (
                                                        <img src={`data:image/svg+xml;base64,${contact.data[0].profilePic}`} alt="profilePic"/>
                                                    ):(
                                                        <img src={NoDP} alt="no profile "/>
                                                    )
                                                }
                                                
                                            </div>
                                            <div className="username">
                                                <p className="u-name">{contact.data[0].name}</p>
                                                <p className="u-uname"><span>@</span>{contact.data[0].username}</p> 
                                            </div>
                                                {newMsg.to === contact.data[0].username ? (
                                                    newMsg.new?(
                                                        <div className='newmsg'>
                                                          <TbMessageCircle/>&nbsp;<span>{newMsg.msg} ...</span> 
                                                        </div>
                                                    ):""
                                                ):""}
                                            
                                            
                                        </div>
                                     ):(
                                        <div className='contact'>
                                            <div className='profile' style={{opacity:"0.5"}}>
                                                <img src={NoDP} alt="no profile "/>
                                            </div>
                                             <div className='username' style={{opacity:"0.4"}}>
                                                <p className="u-name" >{contact.data[0].name}</p>
                                                <p className="u-uname"><span>@</span>{contact.data[0].username}</p>
                                               {/* <p className="u-name">&nbsp;&nbsp;&nbsp;&nbsp;<b style={{color:"rgba(255,0,0,.6)"}}>{contact.data[0].username}</b> is blocked </p> */}
                                             </div>
                                             <div className='unb' onClick={()=>FunUnblockUser(contact.data[0].username)}>
                                                {whoBlocked[0] === currentUser.username ? "Unblock":""}
                                             </div>
                                             
                                        </div>
                                     )
                                  }
                                </>
                                )
                            }):<p id="loading">Loading . . .</p>
                        }
                    </div>
                    <div className="current-user">
                        <p onClick={()=> setSearchPopup(true)}><BiPencil className='pencil'/><p>Start conversation with new friends </p><FaUserFriends className='grp'/> </p>
                        <SearchPopup popup={search_popup} setPopup={setSearchPopup} currentUser={currentUser} conloader={contact_loader}></SearchPopup>
                    </div>
                </Container> 
            )
         }
         </>
    )
}


const Container = styled.div`
  display:grid;
  grid-template-rows:10% 70% 20%;
  overflow:hidden;
  background-color:rgb(10,1,20);//rgb(6,6,50);
  gap:1rem;
  .brand{
    margin-top: 1rem;
    display:flex;
    align-items:center;
    //justify-content:center;
    gap:1rem;
    #search{
        color:cornflowerblue;
        font-size: 1.75rem;
        margin-left: 0rem;
        &:hover{
            cursor: pointer;
        }
    }
    #searchbar
    {
        color:white;//rgba(0,0,0, 0.95);
        background-color: transparent;// cornflowerblue;
        width:0rem;
        opacity: 0;
        height:1rem;
        border-radius: 10rem;
        font-size: 1.2rem;
        outline: none;
        font-weight: bold;
        border: none;
        /* box-shadow: -2px -2px 2px rgba(0,0,0, 0.2),
                        0px 0px 1.5px rgba(255,255,255, 0.2),
                        inset -2px -2px 2px rgba(0,0,0, 0.2),
                    inset  2px 2px 2px rgba(255,255,255, 0.2); */
        transition: opacity 1.5s , width 1.5s,margin-left 1.5s;
        &::placeholder {
            font-size: 1rem;
             opacity:0.9;
             color:cornflowerblue;
         }
    }
  }
  .contacts{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap:0.8rem;
    #loading{
            color:white;
        }
    &::-webkit-scrollbar{
        width:0.2rem;
        &-thumb{
            background-color: cornflowerblue;
            width:0.2rem;
            border-radius: 1.5rem;
        }
    }
    .contact{
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
        position: relative;
       .unb{
          display: flex;
          position:absolute;
          right:1rem;
          font-size:.8rem;
          color:rgb(10,1,20);
          transition: 0.2s ease-in-out;
          &:hover{
            color:rgba(255,0,0,0.7);
          }
       }
        .profile{
            img{
                height:3.5rem;
                border-radius:50%;
            }
        }
        .newmsg{
            display: flex;
            position:absolute;
            right:2rem;
            font-size:1.25rem;
            color:rgb(10,1,20);
            span{
                font-size:.75rem;
                color:white;
                padding-top:.3rem;
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
                           color:rgb(198,198,198);
                          font-size:0.75rem;
                          margin-top:-1.25rem;
                          span{
                            color:#1f2938;//rgb(50,50,50);
                          }
                          &:hover{
                            color: white;
                            transition: 0.5s;
                            cursor: pointer;
                        }
                       }
        }
        .ddl-rmv{
            .dropdown-menu{
                
                z-index: 1000;  
                display: none;  
                float: left;  
                min-width: 160px;  
                padding: 5px 0;  
                margin: 2px 0 0;  
                font-size: 14px;  
                list-style: none;  
                background-color: #ffffff;  
                border: 1px solid #cccccc;  
                border: 1px solid rgba(0, 0, 0, 0.15);  
                border-radius: 4px;  
                -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);  
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);  
                background-clip: padding-box;  

            }
            
        }
    }
    .selected{
        background-color:coral;
    }
  }
  .current-user{
    display:flex;
    background-color:transparent;//cornflowerblue;
    justify-content:center;
    align-items: center;
    gap:1rem;
    margin-bottom:1.5rem;
    color:cornflowerblue;
    p{
        display: flex;
        .grp{
            font-size:1.1rem;
            margin-top: 1.2rem;
            margin-left: 0.8rem;
        }
        .pencil{
            font-size:1.1rem;
            margin-top: 1.1rem;
            margin-right:0.5rem;
        }
        p{
            font-size: 1.2rem;
            cursor: pointer;
        }
    }
    @media screen and (min-width:720px) and (max-width:1080px) {
        gap:0.5rem;
    }
  }
`

export default Contacts