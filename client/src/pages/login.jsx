import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link,useNavigate} from 'react-router-dom';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute,statusRoute } from '../utils/ApiRoutes';
import WebLogo from '../assets/weblogo.png';
import Seear from '../assets/morty.png';
import eyes from '../assets/eye.png';

function Login()
{
    const navigate=useNavigate();

    // document.addEventListener('mousemove',(e)=>{
    //     const mx=e.clientX;
    //     const my=e.clientY;

    //     const anchor =document.getElementById("anchor");
    //     const rekt=anchor.getBoundingClientRect();
    //     const ax=rekt.left + rekt.width /2 ;
    //     const ay=rekt.top + rekt.height /2 ;

    //     const angleDeg =angle(mx,my,ax,ay);

    //     const eyes=document.querySelectorAll('.eye');

    //     eyes.forEach(eye =>{
    //         eye.style.transform = `rotate(${90+angleDeg}deg)`;
    //     })

    //     //console.log(mx+" "+my);
    // })

    // function angle(cx,cy,ex,ey){
    //     const dx=ex-cx;
    //     const dy=ey-cy;

    //     const red=Math.atan2(dy,dx);

    //     const deg=red * 180 /Math.PI;

    //     return deg;
    // }

    const[values,setValues]=useState({
        username:"",
        password:"",
    });

    useEffect(() => {
         document.getElementById("submit-btn").innerText = "Login";
          if(sessionStorage.getItem("timepasser"))
          {
            navigate('/')
          }
    },[])

    const handleSubmit = async (e) =>{
        e.preventDefault();
       if(handleValidation())
       {
        document.getElementById("submit-btn").innerText = "Logging in  ...";
        const {username,password} = values;      
        const udata = await axios.post(loginRoute,{username,password},{headers:{"Content-Type" : "application/json"}});
       
        if(udata.data.valid === false){
            document.getElementById('submit-btn').innerText="Invalid details";
            toast.error(udata.data.msg,toastOp);
         }
         if(udata.data.valid === true){

            
            //console.log(udata.data.userdet.username);
            sessionStorage.setItem("timepasser",JSON.stringify(udata.data.userdet))
           
                const uStatus = await axios.post(statusRoute,{
                    user:udata.data.userdet.username
                });
                //console.log(uStatus)
                if(uStatus){
                    navigate('/')
                }
               
            
         }

         
       }

    }
    
    const toastOp={
            position:"bottom-right",
            autoClose:2500,
            pauseOnHover:true,
            draggable:true,
            closeOnClick: true,
    }

    

     const handleValidation=()=>{
       const {username,password} = values;

       if(password === "" || username === "")
       {
           toast.error("Please fill all the fields 🥱",toastOp);
           return false;
       }
       else{ return true;}

     }

    const handleChange = (e) =>{
         const eventh=e.target
         setValues({...values,[eventh.name]:eventh.value});

         //console.log(values)
    }

    const setFocus =(focus,field)=>{
        if(focus){
            document.getElementById(field).focus();
        }
    }

    return(
        <>
          <FormContainer>
            {/* <div id="anchor">
                <img src={Seear} alt=""/>
                <div id="eyes">
                    <img className='eye' src={eyes} alt="" style={{bottom:"3.8rem",left:"3.2rem"}}/>
                    <img className='eye' src={eyes} alt="" style={{bottom:"4.1rem",left:"5.1rem"}}/>
                    <img className='eye' src={eyes} alt="" style={{bottom:"7.7rem",left:"7.2rem"}}/>
                    <img className='eye' src={eyes} alt="" style={{bottom:"7.78rem",left:"9rem"}}/>
                </div>
            </div> */}
            <form onSubmit={(e) => handleSubmit(e)}>
               <div className='logo'>
                   <img src={WebLogo} alt="DoChat"/>
               </div>

               <input id="inp-uname" type="text" name="username" placeholder='Username' autoComplete='on' onMouseOver={()=>setFocus(true,"inp-uname")} onMouseOut={()=>setFocus(false,"inp-uname")} onChange={ e => handleChange(e)}/> 
               <input id="inp-pswd" type="password" name="password" placeholder='Password' onMouseOver={()=>setFocus(true,"inp-pswd")} onMouseOut={()=>setFocus(false,"inp-pswd")} onChange={ e => handleChange(e)}/> 
              
             
               <button id="submit-btn" type='submit' value="Login"> Login </button>
               <span> Don't have an account ? <Link to="/register">Create Account</Link></span>
            </form>
           
          </FormContainer>
          <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}} />
          </>
        )
}

const FormContainer = styled.div`
height:100vh;
width:95vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:rgb(10,1,20);
.logo{
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;

    img{
        height:3rem;
    }
}
div{
    #eyes,#eyes img{
        position:absolute;
        .eye{
            height:.95rem;
            border-radius:1rem;
        }
    }
}
form{
    display: flex;
    flex-direction: column;
    gap:2rem;
    padding:2rem;

    input{
        outline:none;
        background-color: transparent;
        padding: 1rem;
        border: 1px solid cornflowerblue;
        border-radius:12px;
        font-size:1rem;
        width:100%;
        color:white;
        caret-color:cornflowerblue;
        &:hover{
            border:3px solid  cornflowerblue;
        }
        &:focus{
            border:3px solid  cornflowerblue;
        }
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
               transition:  background-color 5000s ease-in-out 0s;
        }
        &:-webkit-autofill{
                -webkit-text-fill-color:white;
        }
    }
    button{
        width:113%;
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
    span{
        color:white;
        a{
            color:cornflowerblue;
            font-weight:bold;
            text-decoration:none;
            &:hover{
                color:blueviolet;
                text-decoration:underline;
            }
        }
    }
}

`;

export default Login