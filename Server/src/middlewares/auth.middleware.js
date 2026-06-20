
// import jwt from "jsonwebtoken";
// import User from "../models/User.model.js";
// import Admin from "../models/Admin.model.js"; // 👈 import Admin

// const protect = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt;

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Not authorized to access this route"
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         console.log("decode", decoded);

//         //  Check role from token to decide which model to query
//         if (decoded.role === "admin") {
//             req.user = await Admin.findById(decoded.userId).select("-password");
//         } else {
//             req.user = await User.findById(decoded.userId).select("-password");
//         }

//         if (!req.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "user not found"
//             });
//         }

//         next();

//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export default protect;



import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // ✅ Check Authorization header first (preferred)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // ✅ Fallback to cookie (backwards compatibility)
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("decode", decoded);

        // Check role from token to decide which model to query
        if (decoded.role === "admin") {
            req.user = await Admin.findById(decoded.userId).select("-password");
        } else {
            req.user = await User.findById(decoded.userId).select("-password");
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export default protect;