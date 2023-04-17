import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {IoMdSend} from "react-icons/io";
import {BsEmojiLaughingFill, BsEmojiSunglassesFill, BsEmojiWinkFill} from "react-icons/bs";

function ChatInput({handleSendMsg})
{
   const [showEmojis,setShowEmojis]=useState(false);
   const [msg,setMsg]=useState("");

   const handleEmojisView =()=>{
    setShowEmojis(!showEmojis);
   }

   const handleEmojiClick =(event,emoji)=>{
       let message=msg;
       message+=emoji.emoji;
       setMsg(message);
   }

   const sendChat=(event)=>{
    event.preventDefault();
    if(showEmojis)
    {
        setShowEmojis(!showEmojis)
    }
    if(msg.length>0)
    {
        handleSendMsg(msg);
        setMsg("");
    }
   }

   const handleKeyPress=(e)=>{
     if(e.key === "Enter")
     {
        sendChat(e);
     }
   }

  

   return(
    <>
    <Container>
      <form className="input-container">
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSunglassesFill onClick={handleEmojisView}/>
                    {
                        showEmojis && <Picker onEmojiClick={handleEmojiClick}/>
                    }
                </div>
            </div>
           <input type="text" onKeyDown={handleKeyPress} placeholder="Message .." value={msg} onChange={(e)=>setMsg(e.target.value)}/>
      </form>
      <div className="send-msg" id="sender" onClick={(e)=> sendChat(e)}>
                 <IoMdSend/>
      </div>
    </Container>
    </>
   )
}


const Container=styled.div`
display: grid;
grid-template-columns: 95% 5%;
align-items: center;
background-color:transparent;
padding: 0 2rem;
padding-bottom: 0.3rem;
.input-container{
    display:grid;
    grid-template-columns:5% 95%;
    border-radius: 2rem;
    align-content: center;
    gap:1rem;
    background-color:#1f2938; 
    .button-container{
        display: flex;
        align-items: center;
        padding-left:1rem;
        .emoji{
            position:relative;
            svg{
                font-size:1.25rem;
                cursor:pointer;
                color:cornflowerblue;
            }
            .emoji-picker-react{
                position:absolute;
                z-index:1;
                top:-22.5rem;
                background-color:cornflowerblue;
                box-shadow:0 5px 5px black;
                border-radius:1rem;
                border:none;
                .emoji-search{
                    background-color:#1f2938;
                    border:none;
                    border-radius:1rem;
                }
                .emoji-group:before{
                    background-color:cornflowerblue;
                    color:rgb(10,1,20);
                    font-size:0.75rem;
                }
                .emoji-scroll-wrapper::-webkit-scrollbar{
                    width:0.3rem;
                    &-thumb{
                        background-color:#1f2938;
                        border-radius:0.1rem;
                        height:2rem;
                    }
                }
            }
        }
    }
    input{
        width:90%;
        background-color:transparent;
        color:white;
        border:none;
        padding-left:1rem;
        font-size:1.3rem;
        caret-color:cornflowerblue;
        &::selection{
            background-color:cornflowerblue;
        }
        &:focus{
            outline:none;
        }
        &::placeholder {
            color:rgba(150,150,150,0.9);
            font-size:1.3rem;
            font-family: "Josefin Sans",sans-serif;
          }
    }

}
.send-msg{
    margin-left:0.5rem;
    height:3rem;
    width:3rem;
    background-color:cornflowerblue;
    display:flex;
    align-itmes:center;
    justify-content:center;
    border-radius:50%;
    svg{
        margin-top:0.8rem;
        font-size:1.3rem;
    }
 }
`;

export default ChatInput