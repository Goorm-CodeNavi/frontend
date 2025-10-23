import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserinfo } from "../api/userApi";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = async () => {
        if (!isLoggedIn) {
            setUser(null);
            setError(null);
            return;
        }
        try {
            setLoading(true);
            const me = await getUserinfo();
            setUser(me);
            setError(null);
        } catch (err) {
            setUser(null);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // 로그인 상태가 true가 되면 프로필 로딩
    useEffect(() => {
        if (isLoggedIn) {
            refresh();
        } else {
            setUser(null);
            setError(null);
        }
    }, [isLoggedIn]);

    const value = useMemo(
        () => ({ user, loading, error, refresh, setUser }),
        [user, loading, error]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
};