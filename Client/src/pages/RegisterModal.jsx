
import React, { useState } from 'react';
import { Eye, EyeOff, X, Mail, Lock, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await registerUser(formData);

            const role = res.data.user.role;

            onClose(); // close modal

            // 🔥 role-based redirect
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#060B18]/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-[440px] bg-[#0E1830] border border-[#00E5FF]/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.1)] overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#4A5A80] hover:text-[#EDF2FF] transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="font-syne text-2xl font-bold text-[#EDF2FF] mb-2">Create Account</h2>
                    <p className="text-sm text-[#8899BB]">Join developers mastering their interviews.</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-mono text-[#8899BB] uppercase tracking-wider mb-2 font-medium">
                            // Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5A80] group-focus-within:text-[#00E5FF] transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-[#060B18] border border-[#00E5FF]/10 rounded-xl pl-12 pr-4 py-3 text-[#EDF2FF] text-sm focus:outline-none focus:border-[#00E5FF]/40 transition-all placeholder:text-[#4A5A80]"
                                placeholder="Enter Your Full Name"
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-mono text-[#8899BB] uppercase tracking-wider mb-2 font-medium">
                            // Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5A80] group-focus-within:text-[#00E5FF] transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#060B18] border border-[#00E5FF]/10 rounded-xl pl-12 pr-4 py-3 text-[#EDF2FF] text-sm focus:outline-none focus:border-[#00E5FF]/40 transition-all placeholder:text-[#4A5A80]"
                                placeholder="name@example.com"
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-mono text-[#8899BB] uppercase tracking-wider mb-2 font-medium">
                            // Create Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5A80] group-focus-within:text-[#00E5FF] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-[#060B18] border border-[#00E5FF]/10 rounded-xl pl-12 pr-12 py-3 text-[#EDF2FF] text-sm focus:outline-none focus:border-[#00E5FF]/40 transition-all placeholder:text-[#4A5A80]"
                                placeholder="••••••••"
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5A80] hover:text-[#00E5FF] transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-red-400 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00E5FF] text-[#000] font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all mt-4 cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Create Free Account"}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-[#4A5A80]">
                    Already have an account?
                    <button
                        onClick={onLoginClick}
                        className="text-[#00E5FF] hover:underline ml-1 font-medium cursor-pointer"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;
