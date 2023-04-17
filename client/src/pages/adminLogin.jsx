import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link,useNavigate} from 'react-router-dom';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute,statusRoute } from '../utils/ApiRoutes';

function AdminLogin()
{
    const navigate=useNavigate();

    const[values,setValues]=useState({
        username:"",
        email:"",
        password:"",
    });

    useEffect(() => {
          if(sessionStorage.getItem("admin-dochat-28211"))
          {
            navigate('/admin-dochat');
          }
    },[])

    const handleSubmit = async (e) =>{
        e.preventDefault();
       if(handleValidation())
       {
        const {username,email,password} = values;      
        
        if(username === "DoChatAdmin" && email === "admin@dochat.react" && password === "admin28211dochat")
        {
            sessionStorage.setItem("admin-dochat-28211","ok");
            navigate("/admin-dochat");
        }
        else{
            toast.error("Are you trying to be admin 🙄",toastOp);
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
       const {username,email,password} = values;

       if(password === "" || username === ""||email ==="" )
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

    return(
        <>
          <FormContainer>

            <form onSubmit={(e) => handleSubmit(e)}>
               <div className='logo'>
                   <h1>DoChat - Admin</h1>
               </div>

               <input type="text" name="username" placeholder='Username' autoComplete='off' min='4' onChange={ e => handleChange(e)}/> 
               <input type="text" name="email" placeholder='Email' autoComplete='off' min='5' onChange={ e => handleChange(e)}/> 
               <input type="password" name="password" placeholder='Password' onChange={ e => handleChange(e)}/> 
              
             
               <button type='submit'> Login </button>
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
        height:5rem;
    }
    h1
    {
        color:cornflowerblue;
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

export default AdminLogin