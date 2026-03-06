// https://react.dev/reference/react/useContext

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // check if user is already logged in
    useEffect(function () {

        async function checkUser() {

            try {
                const response = await fetch("/api/auth/me", {
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }

            } catch (error) {
                console.log("Auth check failed");
            }

            setLoading(false);
        }

        checkUser();

    }, []);

    async function login(email, password) {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        setUser(data);
    }

    async function logout() {

        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}