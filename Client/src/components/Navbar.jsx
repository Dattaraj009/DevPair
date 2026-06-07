



// import React, { useState, useEffect } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { Menu, X, LogOut, LayoutDashboard, BarChart3, User } from "lucide-react";
// import { useAuth } from "../context/AuthContext.jsx";

// const Navbar = ({ onLoginClick, onRegisterClick }) => {
//   const { user, logoutUser } = useAuth();
//   const isAdmin = user?.role === "admin";
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   const isHomePage = location.pathname === "/";

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       setIsMobileMenuOpen(false);
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const navLinks = [
//     { name: "How it works", id: "how-it-works" },
//     { name: "Features", id: "comparison" },
//     { name: "Blog", id: "social-proof" },
//   ];

//   const navBg = !isHomePage || isScrolled 
//     ? "bg-[#060B18]/95 backdrop-blur-md border-b border-white/5" 
//     : "bg-transparent";

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-[9999] h-[72px] px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${navBg}`}>
      
//       {/* 1. Logo */}
//       <Link to="/" className="flex items-center gap-[10px] font-syne text-[22px] font-[800] text-[#EDF2FF] no-underline shrink-0">
//         <div className="relative w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF]">
//           <div className="absolute inset-0 w-full h-full bg-[#00E5FF] rounded-full blur-[4px] animate-pulse"></div>
//         </div>
//         <span>Interv<span className="text-[#00E5FF]">IQa</span></span>
//       </Link>

//       {/* 2. Desktop Navigation (Center) 
//           CHANGE: Added 'justify-center flex-1' and removed 'absolute'
//       */}
//       <div className="hidden lg:flex items-center justify-center flex-1 gap-[32px]">
//         {!user && navLinks.map((item) => (
//           <a key={item.id} href={`/#${item.id}`} className="text-[14px] font-[500] text-[#8899BB] hover:text-[#00E5FF] transition-colors">
//             {item.name}
//           </a>
//         ))}

//         {user && !isAdmin && (
//           <div className="flex items-center gap-8">
//             <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 text-[14px] font-[500] ${isActive ? "text-[#00E5FF]" : "text-[#8899BB]"}`}>
//               <LayoutDashboard size={16} /> Dashboard
//             </NavLink>
//             <NavLink to="/progress" className={({ isActive }) => `flex items-center gap-2 text-[14px] font-[500] ${isActive ? "text-[#00E5FF]" : "text-[#8899BB]"}`}>
//               <BarChart3 size={16} /> Progress
//             </NavLink>
//             <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 text-[14px] font-[500] ${isActive ? "text-[#00E5FF]" : "text-[#8899BB]"}`}>
//               <User size={16} /> Profile
//             </NavLink>
//           </div>
//         )}
//       </div>

//       {/* 3. Auth Actions */}
//       <div className="flex items-center gap-4 shrink-0">
//         {!user ? (
//           <div className="flex gap-4">
//             <button onClick={onLoginClick} className="text-[#8899BB] text-[14px] font-[500]">Log in</button>
//             <button onClick={onRegisterClick} className="px-5 py-2.5 bg-[#00E5FF] rounded-lg text-black text-[14px] font-[700]">Join Now</button>
//           </div>
//         ) : (
//           <div className="flex items-center gap-4 border-l border-white/10 pl-4">
//             <div className="hidden md:block text-right">
//               <p className="text-[12px] font-bold text-[#EDF2FF] leading-none">{user.name}</p>
//               <p className="text-[10px] text-[#4A5A80] uppercase font-mono">{user.role}</p>
//             </div>
//             <button onClick={handleLogout} className="text-[#4A5A80] hover:text-[#FF4466] transition-colors">
//               <LogOut size={18} />
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, BarChart3, User, ShieldAlert, Users, FileQuestion } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, logoutUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "How it works", id: "how-it-works" },
    { name: "Features", id: "comparison" },
    { name: "Blog", id: "social-proof" },
  ];

  // Smooth frosted glass effect when scrolled or not on home page
  const navBg = !isHomePage || isScrolled 
    ? "bg-[#060B18]/80 backdrop-blur-xl border-b border-white/5 shadow-sm" 
    : "bg-transparent";

  // Shared active/inactive classes for NavLinks
  const getNavLinkClass = (isActive) => 
    `flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] font-[600] transition-all duration-200 ${
      isActive 
        ? "bg-[#00E5FF]/10 text-[#00E5FF]" 
        : "text-[#8899BB] hover:bg-white/5 hover:text-[#EDF2FF]"
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] h-[72px] px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${navBg}`}>
      
      {/* 1. Brand Logo */}
      <Link to="/" className="flex items-center gap-[10px] font-syne text-[22px] font-[800] text-[#EDF2FF] no-underline shrink-0 group">
        <div className="relative w-2.5 h-2.5 bg-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF] group-hover:scale-110 transition-transform">
          <div className="absolute inset-0 w-full h-full bg-[#00E5FF] rounded-full blur-[4px] animate-pulse"></div>
        </div>
        <span>Interv<span className="text-[#00E5FF]">IQa</span></span>
      </Link>

      {/* 2. Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-center flex-1 gap-2 mx-8">
        
        {/* Logged Out Links */}
        {!user && navLinks.map((item) => (
          <a 
            key={item.id} 
            href={`/#${item.id}`} 
            className="px-4 py-2 text-[14px] font-[600] text-[#8899BB] hover:text-[#00E5FF] hover:bg-white/5 rounded-lg transition-all"
          >
            {item.name}
          </a>
        ))}

        {/* Regular User Links */}
        {user && !isAdmin && (
          <div className="flex items-center gap-2">
            <NavLink to="/dashboard" className={({ isActive }) => getNavLinkClass(isActive)}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => getNavLinkClass(isActive)}>
              <BarChart3 size={16} /> Progress
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => getNavLinkClass(isActive)}>
              <User size={16} /> Profile
            </NavLink>
          </div>
        )}

        {/* Admin Links */}
        {user && isAdmin && (
          <div className="flex items-center gap-2">
            <NavLink to="/admin/dashboard" className={({ isActive }) => getNavLinkClass(isActive)}>
              <ShieldAlert size={16} /> Admin Panel
            </NavLink>
            <NavLink to="/admin/questions" className={({ isActive }) => getNavLinkClass(isActive)}>
              <FileQuestion size={16} /> Questions
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => getNavLinkClass(isActive)}>
              <Users size={16} /> Users
            </NavLink>
          </div>
        )}
      </div>

      {/* 3. Auth Actions */}
      <div className="flex items-center gap-4 shrink-0">
        {!user ? (
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onLoginClick} 
              className="text-[#8899BB] hover:text-white text-[14px] font-[600] transition-colors px-2"
            >
              Log in
            </button>
            <button 
              onClick={onRegisterClick} 
              className="px-5 py-2.5 bg-[#00E5FF] rounded-lg text-[#060B18] text-[14px] font-syne font-[800] tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Join Now
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
            <div className="hidden md:flex flex-col text-right">
              <p className="text-[13px] font-bold text-[#EDF2FF] leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#00E5FF] uppercase font-mono font-bold tracking-wider">{user.role}</p>
            </div>
            
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#060B18] flex items-center justify-center text-[#00E5FF] font-bold text-sm">
                {user.name?.[0]?.toUpperCase() || <User size={16} />}
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="p-2 text-[#4A5A80] hover:text-[#FF4466] hover:bg-[#FF4466]/10 rounded-lg transition-all"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-[#8899BB] hover:text-white hover:bg-white/5 rounded-lg transition-all" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 4. Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#060B18]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl p-6 flex flex-col gap-4 lg:hidden origin-top animate-in slide-in-from-top-2 duration-200">
          {!user && navLinks.map((item) => (
            <a 
              key={item.id} 
              href={`/#${item.id}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[16px] font-[600] text-[#8899BB] hover:text-[#00E5FF] p-2"
            >
              {item.name}
            </a>
          ))}

          {user && !isAdmin && (
            <>
              <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><LayoutDashboard size={18} /> Dashboard</NavLink>
              <NavLink to="/progress" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><BarChart3 size={18} /> Progress</NavLink>
              <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><User size={18} /> Profile</NavLink>
            </>
          )}

          {user && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><ShieldAlert size={18} /> Admin Panel</NavLink>
              <NavLink to="/admin/questions" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><FileQuestion size={18} /> Questions</NavLink>
              <NavLink to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}><Users size={18} /> Users</NavLink>
            </>
          )}

          {!user && (
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-2">
              <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full py-3 text-[#8899BB] hover:text-white font-[600] bg-white/5 rounded-xl">Log in</button>
              <button onClick={() => { onRegisterClick(); setIsMobileMenuOpen(false); }} className="w-full py-3 bg-[#00E5FF] text-black font-[700] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.2)]">Join Now</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;