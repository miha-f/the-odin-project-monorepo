import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";
import type User from "@/models/User";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    saveToken: (arg0: string) => void;
    getToken: () => string | null;
    logout: () => void;
    refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    saveToken: () => { },
    getToken: () => null,
    logout: () => { },
    refetch: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { return setLoading(false); }

        const { data, error } = await tryCatch<{ msg: User }>(api.get("/auth/me"));

        if (error) {
            localStorage.removeItem("token");
            setLoading(false);
            return;
        }

        setUser(data.msg);
        setLoading(false);
    };

    const saveToken = (token: string) => {
        localStorage.setItem("token", token);
    };

    const getToken = () => localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, saveToken, getToken, logout, refetch: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
