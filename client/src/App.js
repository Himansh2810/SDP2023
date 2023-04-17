import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Chats from './pages/chat'
import Login from './pages/login'
import Register from './pages/register'
import SetProfilePic from './pages/setProfile'
import SeeProfile from './pages/seeProfile'
import styled from 'styled-components'
import AdminLogin from './pages/adminLogin'
import Admin from './pages/admin'
function App()
{
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/setProfile" element={<SetProfilePic/>}></Route>
            <Route path="/seeProfile" element={<SeeProfile/>}></Route>
            <Route path="/adminLogin" element={<AdminLogin/>}></Route>
            <Route path="/admin-dochat" element={<Admin/>}></Route>
            <Route path="/" element={<Chats/>}></Route>
            <Route path="*" element={<ErrorPage/>}></Route>
        </Routes>
        </BrowserRouter>
    )
}

function ErrorPage()
{
    return(
        <Div>
           <h1>Incorrect Path !!</h1> 
        </Div>
    )
}

const Div=styled.div`
 color:coral;
`

export default App