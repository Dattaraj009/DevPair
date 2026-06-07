// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const AdminRoute = ({ children }) => {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return (
//             <div className="pt-32 text-center text-white">
//                 Loading...
//             </div>
//         );
//     }

//     // Not logged in
//     if (!user) {
//         return <Navigate to="/" replace />;
//     }

//     // Logged in but not admin
//     if (user.role !== "admin") {
//         return <Navigate to="/dashboard" replace />;
//     }

//     // Admin → allow
//     return children;
// };

// export default AdminRoute;



import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

