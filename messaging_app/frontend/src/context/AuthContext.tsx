import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    username: string
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // on mount, check if user info or token exists (e.g. localStorage)
        // set user if valid, else null
        setLoading(false);
    }, []);

    async function login(username: string, password: string) {
        // call backend API to login, get tokens, user info
        // store tokens in memory or localStorage
        // setUser with user data
    }

    function logout() {
        // clear tokens and user
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
