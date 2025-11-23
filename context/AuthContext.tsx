import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useData } from './DataContext';
import { API_URL } from '../utils/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    updateProfile: (user: User) => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isOffline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addUser, updateUser, users } = useData();

    // Initialize user from LocalStorage to persist login on refresh
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('nrk_currentUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [isOffline, setIsOffline] = useState(false);

    // Sync with LocalStorage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('nrk_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('nrk_currentUser');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            console.log("Attempting login via API...");
            // 1. Try Backend API
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsOffline(false);
                return true;
            } else {
                console.error("Login failed:", await response.text());
                return false;
            }
        } catch (error) {
            // 2. Offline Fallback (If Node server is not running)
            console.warn("Server connection failed. Switching to Offline Demo Mode.");
            setIsOffline(true);

            const localUser = users.find(u => u.email === email && u.password === password);
            if (localUser) {
                setUser(localUser);
                return true;
            }
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nrk_currentUser');
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            // 1. Try Backend API
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                const newUser = await response.json();
                setUser(newUser);
                // Also add to local DataContext to keep UI in sync immediately
                addUser(newUser);
                setIsOffline(false);
                return true;
            }
            return false;
        } catch (error) {
            // 2. Offline Fallback
            console.warn("Server connection failed. Registering in Offline Demo Mode.");
            setIsOffline(true);

            // Check if email exists locally
            if (users.some(u => u.email === email)) {
                return false;
            }

            const newUser: User = {
                id: Date.now().toString(),
                name,
                email,
                password,
                role: 'user'
            };

            addUser(newUser);
            setUser(newUser);
            return true;
        }
    };

    const updateProfile = async (updatedUser: User) => {
        try {
            // 1. Try Backend API
            const response = await fetch(`${API_URL}/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                setUser(updatedUser);
                updateUser(updatedUser);
                setIsOffline(false);
            } else {
                throw new Error("API Error");
            }
        } catch (error) {
            console.warn("Server connection failed. Updating profile in Offline Demo Mode.");
            setIsOffline(true);

            // 2. Offline Fallback
            setUser(updatedUser);
            updateUser(updatedUser);
            alert("Profile saved locally (Server Offline)");
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            updateProfile,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            isOffline
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};