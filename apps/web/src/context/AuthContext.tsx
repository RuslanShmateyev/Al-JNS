import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LoginDto, RegisterDto, AuthResponseDto } from '@al-jns/contracts';

interface AuthContextType {
    user: any | null;
    token: string | null;
    loading: boolean;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optional: Fetch current user profile to verify token
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (data: LoginDto) => {
        const response = await axios.post<AuthResponseDto>(`${API_URL}/auth/login`, data);
        const { user, accessToken } = response.data;
        setToken(accessToken);
        setUser(user);
        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    };

    const register = async (data: RegisterDto) => {
        const response = await axios.post<AuthResponseDto>(`${API_URL}/auth/register`, data);
        const { user, accessToken } = response.data;
        setToken(accessToken);
        setUser(user);
        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
