// import { createContext, useContext,useEffect,useState } from "react";
// import {
//     login,
//     register,
//     googleLogin,
//     getMe,
//     logout, 
// } from "../api/auth.api"



// const AuthContext = createContext();


// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);


//     const loadUser = async () => {
//         try {
//             const res = await getMe();
//             setUser(res.data.user);
//         } catch (err) {
//             setUser(null);
//             console.log(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadUser();
//     }, []);

//     const loginUser = async (data) => {
//         const res = await login(data);
//         setUser(res.data.user);
//         return res;
//     };

//     const registerUser = async (data) => {
//         const res = await register(data);
//         setUser(res.data.user);
//         return res;
//     };

//     const loginWithGoogle = async (idToken) => {
//         const res = await googleLogin(idToken);
//         setUser(res.data.user);
//         return res;
//     };

//     const logoutUser = async () => {
//         const res = await logout();
//         setUser(null);
//         return res;
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 loginUser,
//                 registerUser,
//                 loginWithGoogle,
//                 logoutUser,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
//     }

//     export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useEffect, useState } from "react";
import {
    login,
    register,
    googleLogin,
    getMe,
    logout, 
} from "../api/auth.api"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            // ✅ Check if token exists before making request
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const res = await getMe();
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
            // ✅ Clear token if request fails
            localStorage.removeItem('token');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const loginUser = async (data) => {
        const res = await login(data);
        setUser(res.data.user);
        
        // ✅ Store token in localStorage
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        
        return res;
    };

    const registerUser = async (data) => {
        const res = await register(data);
        setUser(res.data.user);
        
        // ✅ Store token in localStorage
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        
        return res;
    };

    const loginWithGoogle = async (idToken) => {
        const res = await googleLogin(idToken);
        setUser(res.data.user);
        
        // ✅ Store token in localStorage
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        
        return res;
    };

    const logoutUser = async () => {
        try {
            await logout();
        } catch (err) {
            console.log(err);
        } finally {
            // ✅ Clear token and user
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginUser,
                registerUser,
                loginWithGoogle,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);