





import Navbar from "../components/Navbar";
import LoginModal from "../pages/LoginModal";
import RegisterModal from "../pages/RegisterModal";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom"; // Added useLocation
import { useState } from "react";

const AppLayout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const location = useLocation(); // Initialize location

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex flex-col">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      {/* pt-[72px] ensures content starts below the Navbar.
          key={location.pathname} forces a clean render on route changes.
      */}
      <main className="flex-grow pt-[72px]">
        <Outlet key={location.pathname} context={{ onRegisterClick: openRegister }} />
      </main>

      <Footer />

      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onRegisterClick={openRegister} />
      )}
      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onLoginClick={openLogin} />
      )}
    </div>
  );
};

export default AppLayout;