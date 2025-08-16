import React from 'react'
import Home from './home/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './authentication/Login';
import Registion from './authentication/Registion';
import ForgetPassword from './authentication/ForgetPassword';
import EmailValidate from './authentication/EmailValidate';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/auth/register" element={<Registion />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/email-validate" element={<EmailValidate />} />
        <Route path="*" element={<Login />} /> {/* or a NotFound page */}
      </Routes>
    </div>
  )
}
