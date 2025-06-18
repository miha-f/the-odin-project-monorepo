'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { User } from "@/utils/models";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => void;
    refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => { },
    refetch: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) { return setLoading(false); }

        const { data: user, error } = await tryCatch<User>(api.get("/auth/me"));

        if (error) {
            localStorage.removeItem("token");
            return;
        }

        setUser(user);
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refetch: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
