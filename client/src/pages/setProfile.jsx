import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { profileRoute } from '../utils/ApiRoutes';
import { Buffer } from "buffer";
import loader from '../assets/loader1.svg';
import { useLocation } from "react-router-dom";



function SetProfilePic()
{
  const location=useLocation();
  const currentUser=location.state.user;
 

  useEffect(()=>{
    if(!currentUser){
        navigate("/");
    }
  },[currentUser]);

  const navigate=useNavigate();
     useEffect(()=>{
        // console.log(localStorage.getItem("timepasser"));
         if(!sessionStorage.getItem("timepasser"))
         {
          navigate("/login");
         }
     },[])  

    const toastOp={
        position:"bottom-right",
        autoClose:5000,
        pauseOnHover:true,
        draggable:true,
        closeOnClick: true,
    }
    const picApi = "https://api.multiavatar.com/45678945";
    

    const [profpic,setProfpic] = useState([])
    
    const [isLoading,setIsLoading] = useState(true)

    const [selectedPic,setSelectedPic] = useState(undefined)

    

    const setProfilepicture= async () =>{
      if(selectedPic === undefined)
      {
        toast.error("Please Select an Picture first",toastOp);
      }
      else{
        const {data}=await axios.post(profileRoute,{
          image :profpic[selectedPic],
          user:currentUser.username
        });
       
        if(data.isSet)
        {
          
           
            navigate('/seeProfile',{
            state:{
                user:currentUser
            }
          })
        }
        else{
          toast.error("Error in Setting Picture , Please try again !",toastOp);
        }
      }
    }
    //${picApi}/${Math.round(Math.random()*1000)}
    const bgcolors=['b6e3f4','c0aede','d1d4f9','ffd5dc','ffdfbf','6495ed','1f2938'];
    const [avatarType,setAvatarType]=useState('micah');
    
    
    useEffect( ()=>{
      async function load()
      {
        const data=[]
        
        //console.log("ehee 2")
        for(let i=0;i<7;i++)
        {
          const image = await axios.get(`https://api.dicebear.com/6.x/${avatarType}/svg?backgroundColor=${bgcolors[Math.floor(Math.random()*(7))]}&radius=50&seed=${Math.round(Math.random()*1000)}`);
          const buffer= new Buffer(image.data)
          data.push(buffer.toString("base64"))  
       }
        setProfpic(data)
       setIsLoading(false)
      }

      load();
    },[avatarType]);

   let back=">";

   const changeAvtr=(e)=>{
    setAvatarType(e.target.value+"");
    setIsLoading(true);
    //console.log(":::"+e.target.value);
   }
   return (
    <>
    {
      isLoading?<Container>
               <nav>
                <button onClick={()=> navigate("/seeProfile",{state:{user:currentUser}})}>Back&nbsp;{back}</button>
              </nav>
              
             <img src={loader} alt="loader" className="loader"/>
             <div className="title-container">
               <h4>Loading. . .</h4>
             </div>
      </Container>:(
        <Container>
            <nav>
               <button onClick={()=> navigate("/seeProfile",{state:{user:currentUser}})}>Back&nbsp;{back}</button>
            </nav>
            <div className="title-container">
              <h1>Pick a Picture as Your Profile Pic</h1>
            </div>
            <div className="reload">
               <span>Avatar Type : </span>
               <select onChange={e => changeAvtr(e)}>
                <option>Select Type</option>
                <option value="micah">micah</option>
                <option value="adventurer">adventurer</option>
                <option value="avataaars">avataaars</option>
                <option value="bottts">bottts</option>
                <option value="notionists">notionists</option>
                <option value="croodles">croodles</option>
               </select>
            </div>
            <div className="profpics">
                {
              
                  profpic.map((pic,index)=>{
                        return (
                          <div key={index} className={`pic ${selectedPic === index? "selected":""}`}>
                              <img src={`data:image/svg+xml;base64,${pic}`} alt='Profile Pic' onClick={()=>setSelectedPic(index)}></img>
                          </div>
                        )
                  })
                }
            </div>
            <span>{avatarType}</span>
            <button className="submit-btn" onClick={setProfilepicture}>
                    Set As Profile Picture
            </button>
        </Container>
      )
      }
      <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}/>
    </>
   )
}

const Container = styled.div`
display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   gap: 3rem;
   height: 100vh;
   width: 100vw;
   nav{
       button{
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
   }
   .reload{
      display:flex;
      span{
        color:cornflowerblue;
        font-size:1.2rem;
      }
      select{
        text-transform:capitalize;
        background-color:#1f2938;
        height:1.8rem;
        border-radius:.4rem;
        color:cornflowerblue;
        border:none;
        outline:none;
        font-size:.85rem;
        margin-left:.75rem;
        margin-top:-.4rem;
        option{
          border-radius:.4rem;
        }
      }
      
   }

   

   .title-container{
    color:cornflowerblue;
      h1{
         color:cornflowerblue;
      }
   }
   .profpics{
     display:flex;
     gap:2rem;
     .pic{
         border:0.5rem solid transparent;
         padding: 0.5rem;
         border-radius: 5rem;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: 0.5s ease-in-out;      
         img{
            height:6rem;
         }
     }
     .selected{
         border:0.5rem solid cornflowerblue;
     }

   }
   span{
    color:cornflowerblue;
    text-transform:capitalize;
   }
   .submit-btn{
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
`;

export default SetProfilePic