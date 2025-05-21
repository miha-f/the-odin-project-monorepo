import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe as apiGetMe, logout as apiLogout, login as apiLogin } from '../../../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await apiGetMe();
            if (error)
                setUser(null);
            else
                setUser(data.data);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (form) => {
        const { data: _, error } = await apiLogin({
            username: form.username,
            password: form.password,
        });
        if (error)
            return [null, error.response?.data || error.message || "Unknown error"];

        const { data: userData, error: userError } = await apiGetMe();
        if (userError)
            return [null, userError.response?.data || userError.message || "Unknown error"];

        setUser(userData.data);
        return [userData, null];
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
