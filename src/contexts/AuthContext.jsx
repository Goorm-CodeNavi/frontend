import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [tokenType, setTokenType] = useState("Bearer");

    // 앱 시작 시 localStorage에 토큰 있으면 로그인 상태로
    useEffect(() => {
        const t = localStorage.getItem("accessToken");
        const tt = localStorage.getItem("tokenType") || "Bearer";
        if (t) {
            setAccessToken(t);
            setTokenType(tt);
        }
    }, []);

    // 다른 탭에서 로그아웃/로그인해도 동기화
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "accessToken" || e.key === "tokenType") {
                const t = localStorage.getItem("accessToken");
                const tt = localStorage.getItem("tokenType") || "Bearer";
                setAccessToken(t);
                setTokenType(tt);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const isLoggedIn = !!accessToken;

    const login = (newAccessToken, newTokenType = "Bearer", newRefreshToken) => {
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("tokenType", newTokenType);
        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
        }
        setAccessToken(newAccessToken);
        setTokenType(newTokenType);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setTokenType("Bearer");
    };

    const value = useMemo(
        () => ({ isLoggedIn, accessToken, tokenType, login, logout }),
        [isLoggedIn, accessToken, tokenType]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};