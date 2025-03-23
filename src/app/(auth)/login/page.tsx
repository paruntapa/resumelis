"use client"
import React, { useState } from 'react'
import { useRouter, redirect } from 'next/navigation'
import { ToastContainer } from 'react-toastify';
import { BACKEND_URL } from '@/app/config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function login() {
    const router = useRouter()
    const [loginInfo, setloginInfo] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyloginInfo: any = { ...loginInfo };
        copyloginInfo[name] = value;
        setloginInfo(copyloginInfo);
    }

    const handlelogin = async (e: any) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        if (!email || !password) {
            return toast.error('Email and Password are required');
        }
    
        try {
            const url = `${BACKEND_URL}/auth/login`;
            const response = await axios.post(url, loginInfo);
    
            const result = response.data;  
            console.log(result);           
    
            if (result.success) {
                toast.success("Login Successful");
                router.push('/resume');      
            } else {
                toast.error("Invalid Credentials", { position: 'top-right' });
            }
        } catch (err: any) {
            console.error("Login error:", err); 
            toast.error("Login Failed");
        }
    };
    
    return (
        <div className='container  '>
            <h1>login</h1>
            <Toaster position="top-center"/>
            <form onSubmit={handlelogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>login</button>
                <span>Dont't have an account?
                    <p className='cursor-pointer' onClick={() => router.push('/signup')}>Signup</p>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default login