import React, { createContext, useContext, useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { api } from '@/lib/axiosClient'
import { User } from '@/constants/models'
import { tryCatch } from '@/utils/tryCatch'

interface AuthContextType {
    user: User | null
    token: string | null
    signIn: (token: string, username: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    // Load token on app start
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token')
            if (storedToken) {
                setToken(storedToken)
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
                // Optionally fetch user profile here
            }
        }
        loadToken()
    }, [])

    const signIn = async (newToken: string, username: string) => {
        await SecureStore.setItemAsync('token', newToken)
        setToken(newToken)
        console.log("new token: ", newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

        const { data: user, error } = await tryCatch<User>(api.get("/auth/me"));

        if (error) {
            localStorage.removeItem("token");
            return;
        }

        setUser(user);

        // Optionally fetch user profile here
    }

    const signOut = async () => {
        await SecureStore.deleteItemAsync('token')
        setToken(null)
        setUser(null)
        delete api.defaults.headers.common['Authorization']
    }

    return (
        <AuthContext.Provider value={{ user, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}
