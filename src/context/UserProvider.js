import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export const UserContext = createContext();
export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
                    setUser(response.data);
                }
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        fetchData();
    }, [localStorage.getItem("token")]);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
