import React ,{useState,useEffect} from 'react';
import styled from 'styled-components';
import {Link,useNavigate} from 'react-router-dom';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { registerRoute } from '../utils/ApiRoutes';
import WebLogo from '../assets/weblogo.png';

function Register()
{
    const navigate=useNavigate();

     const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
               
                const date=new Date();
                const day= String(date.getDate()).padStart(2, '0');
                const ls=day+" "+monthNames[date.getMonth()]+" "+date.getFullYear();

    const[values,setValues]=useState({
        name:"",
        username:"",
        email:"",
        password:"",
        cpassword:"",
        isProfileSet:false,
        profilePic:"",
        joinedOn:ls
    });

    useEffect(() => {
        if(sessionStorage.getItem("timepasser"))
        {
          navigate('/')
        }

        //setFormError("");
  },[])
    const handleSubmit = async (e) =>{
        e.preventDefault();
       if(handleValidation())
       {
        const {name,username,email,password,isProfileSet,profilePic,joinedOn} = values;
        var nname=name;
        nname=nname.charAt(0).toUpperCase() + nname.slice(1);
        const udata=await axios.post(registerRoute,{
            name:nname,
            username,
            email,
            password,
            isProfileSet,
            profilePic,
            joinedOn
        });

        if(udata.data.valid === false){
            toast.error(udata.data.msg,toastOp);
         }
         if(udata.data.valid === true){
            toast.success("Your account has been created successfully ! 😄",toastOp);
            navigate('/login');
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
       const {name,username,email,password,cpassword} = values;

       if(password !== cpassword)
       {
           toast.error("Oh , Confirm Password and Password should be same.😄",toastOp);
           return false;
       }
       else if(username.length < 6){
              toast.error("You can't take less than 6 characters for username 😄",toastOp);
              return false;
       }
       else if(name === "" || email === "")
       {
         toast.error(" Name and Email fields are required 🥱",toastOp);
         return false;
       }
       else if(formError === ""){ 
        return true;
       }
       else{
         toast.error("Please fill valid field value 🥱",toastOp);
         return false;
       }
     }

    const [formError,setFormError]=useState();

    const handleChange = (e) =>{
         const eventh=e.target
         let eventname=eventh.name
         const eventvalue=eventh.value

         if( eventname === "cpassword")
         {
             eventname = "password"
         }

         switch(eventname){
            
            case "username":
                if(eventvalue.length ===0)
                {
                    setFormError("");
                }
                else if( eventvalue.length > 5 ){                   
                    if(eventvalue.match(/^[a-zA-Z0-9\._]+$/g) === null){
                        setFormError("Username only include Alphabets and numbers or special symbols . or _");
                    }
                    else{
                        setFormError("");
                    }
                    
                }
                else{
                        setFormError("Username length must be greater than 5")
                }
                break;
            case "password":
                if(eventvalue.length === 0 ){
                    setFormError("");
                }
                else if(eventvalue.length >= 8 ){
                     if(eventvalue.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/g) === null)
                     {
                          setFormError("Password must contain alphabet,number and at least one special character (any)")
                     }
                     else{
                        setFormError("");
                     }
                }
                else{
                    setFormError("Password length must be greater than  7")
                }
                break;  
             case "name":
                if(eventvalue.length === 0)
                {
                    setFormError("");
                }
                else if(eventvalue.match(/^[a-zA-Z ]{2,32}$/g) === null){
                    setFormError("Name only contains alphabet and should be greater than 2");
                }
                else{setFormError("");}
                break; 
             case "email":
                if(eventvalue.length === 0)
                {
                    setFormError("");
                }
                else if(eventvalue.match(/\S+@\S+\.\S+/g) === null){
                    setFormError("Email should only contain alphabets ,numbers and @ and .");
                }
                else{setFormError("");}
                break;     
             default:
                  setFormError("")
          
         }
         setValues({...values,[eventh.name]:eventh.value});
    }

    const setFocus =(focus,field)=>{
        if(focus){
            document.getElementById(field).focus();
        }
    }

    return(
        <>
          <FormContainer>

            <form onSubmit={(e) => handleSubmit(e)}>
               <div className='logo'>
                   <img src={WebLogo} alt="DoChat"/>
               </div>
               <input id="inp-name" type="text" name="name" placeholder='Name' autoComplete='off' onMouseOver={()=>setFocus(true,"inp-name")}  onChange={ e => handleChange(e)}/> 
               <input id="inp-uname" type="text" name="username" placeholder='Username' autoComplete='off' onMouseOver={()=>setFocus(true,"inp-uname")}  onChange={ e => handleChange(e)}/> 
               <input id="inp-email" type="email" name="email" placeholder='E-mail' autoComplete='off' onMouseOver={()=>setFocus(true,"inp-email")}  onChange={ e => handleChange(e)}/> 
               <input id="inp-pswd" type="password" name="password" placeholder='Password' onMouseOver={()=>setFocus(true,"inp-pswd")}  onChange={ e => handleChange(e)}/> 
               <input id="inp-cpswd" type="password" name="cpassword" placeholder='Confirm Password' onMouseOver={()=>setFocus(true,"inp-cpswd")}  onChange={ e => handleChange(e)}/> 
             
               <button type='submit'> Create Account </button>
               <span> Already have an account ? <Link to="/login">Login</Link></span>
            </form>

            <span className='validations'>
                {formError}
            </span>
          </FormContainer>
          <ToastContainer toastStyle={{ backgroundColor: "cornflowerblue",color:"black",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}} />
          </>
        )
}

const FormContainer = styled.div`
padding-top:1rem;
margin:auto;
height:95vh;
display:flex;
//flex-direction:column;
justify-content:center;
gap:.5rem;
align-items:center;
background-color:rgb(10,1,20);

.validations{
    color:coral;
    position:fixed;
    left:1rem;
    width:30%;
}
form{
    display: flex;
    flex-direction: column;
    gap:2rem;
    padding:2rem;
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
        justify-content:center;
        align-items:center;
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

export default Register