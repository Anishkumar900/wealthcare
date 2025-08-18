import React, { useContext, useEffect, useState } from 'react'
import Header from '../bar/Header'
import Footer from '../bar/Footer'
import AddMoney from './AddMoney';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import ShowExpenses from './ShowExpenses';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function Home() {

  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);

  useEffect(() => {
          const fetchData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/"); 
                return;
            }

            try {
                const jwt = { token };
                const response = await axios.post(
                    `${baseURL}/api/auth/v1/jwt-verify`,
                    jwt,
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.status === 200) {
                  // console.log(response.data);
                    setUser(response.data)
                }
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        fetchData();
    
  }, [])
  return (
    <div>
      <Header/>
      <div className='pt-16 z-0'>
        <AddMoney/>
        <ShowExpenses/>
        <Footer />
      </div>
      
    </div>
  )
}
