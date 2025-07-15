import { useEffect, useState } from "react";
import AxiosInstance from "../axios/AxiosInstance";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // console.log("userr",userId)

    useEffect(() => {
        AxiosInstance.get("auth/check/")
            .then((res) => {
                console.log("Auth check response fron api:", res.data);

                if (res.data.authenticated) {
                    console.log("res.data.authenticated", res.data.authenticated);
                    setIsAuthenticated(true);
                }
                else {
                    setIsAuthenticated(false);
                }
                setUserId(res.data.user_id);
                // console.log("userrrr",res.data.user)
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUserId(null);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                userId,
                setUserId,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
