import React, { useState } from "react";
import { Eye, EyeOff, X, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.js";

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const { loginUser, loginWithGoogle } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const navigate = useNavigate();

    if (!isOpen) return null;

    //  EMAIL + PASSWORD LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginUser(formData);
            const role = res.data.user.role;

            onClose();

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    //  GOOGLE LOGIN 
    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const res = await loginWithGoogle(idToken);
            const role = res.data.user.role;

            onClose();

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setError("Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-[#060B18]/60 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[420px] bg-[#0E1830] border border-[#00E5FF]/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#4A5A80] hover:text-[#EDF2FF] cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="font-syne text-2xl font-bold text-[#EDF2FF] mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-[#8899BB]">
                        Log in to continue your interview prep.
                    </p>
                </div>

                {/*  GOOGLE BUTTON  */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 py-3 rounded-xl text-[#EDF2FF] text-sm font-medium transition-all mb-6 group cursor-pointer"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="mx-4 text-xs font-mono text-[#4A5A80]">OR</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* EMAIL LOGIN */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-mono text-[#8899BB] uppercase mb-2 tracking-widest font-medium">
              // Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5A80]" size={18} />
                            <input
                                className="w-full bg-[#060B18] border border-[#00E5FF]/10 rounded-xl pl-12 pr-4 py-3 text-[#EDF2FF]"
                                placeholder="name@email.com"
                                required
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-[#8899BB] uppercase mb-2 tracking-widest font-medium">
              // Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5A80]" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-[#060B18] border border-[#00E5FF]/10 rounded-xl pl-12 pr-12 py-3 text-[#EDF2FF]"
                                placeholder="••••••••"
                                required
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5A80]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-400 text-center">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-[#00E5FF] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login to Dashboard"}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-[#4A5A80]">
                    Don't have an account?{" "}
                    <button
                        onClick={onRegisterClick}
                        className="text-[#00E5FF] hover:underline font-medium cursor-pointer"
                    >
                        Sign up for free
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
