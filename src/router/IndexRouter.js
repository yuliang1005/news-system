import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import Details from '../views/news/Details'
import News from '../views/news/News'
import NewsSendBox from '../views/sendbox/NewsSendBox'

export default function IndexRouter() {
    const isLogin = localStorage.getItem('token') ? <NewsSendBox /> : <Navigate to='/login' />
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/news' element={<News />}></Route>
                <Route path='/news/details/:id' element={<Details />}></Route>
                <Route path='*' element={isLogin}></Route>
            </Routes>

        </BrowserRouter>
    )
}
