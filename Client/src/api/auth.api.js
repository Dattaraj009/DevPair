import api from "./axios";

// Email + Password
const register = (data) => {
    return api.post("/auth/register", data);
};

const login = (data) => {
    return api.post("/auth/login", data);
};

// Google Login (idToken comes from Firebase)
const googleLogin = (idToken) => {
    return api.post("/auth/google", { idToken });
};

// Get logged-in user
const getMe = () => {
    return api.get("/auth/me");
};

// Logout
 const logout = () => {
    return api.post("/auth/logout");
};



export { register, login, googleLogin, getMe, logout };
