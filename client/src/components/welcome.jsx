import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import hello from "../assets/200w.webp"

function Welcome({currentUser})
{
   var uname=currentUser.name;
   uname=uname.charAt(0).toUpperCase() + uname.slice(1);
    return(
        <>
        <Container>
            <img src={hello} alt="Welcome"></img>
            <h1>
                Welcome , <span>{uname}!</span>
            </h1>
            <h3>Select a freind/User to Start messaging ..</h3>
        </Container>
        </>
    )
}

const Container=styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color:cornflowerblue;
img{
    height:10rem;
}
span{
    color:coral;
}
`

export default Welcome