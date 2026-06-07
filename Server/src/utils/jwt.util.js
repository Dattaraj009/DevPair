// import jwt from "jsonwebtoken";

// const generateToken = (res, userId, role) => {
//     const token = jwt.sign(
//         { userId, role },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "1d"
//         }
//     );
//     res.cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         // sameSite: "strict",
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         maxAge: 24 * 60 * 60 * 1000 ,// 1 day
//         path: "/"
//     });

//     return token;
// }

// export default generateToken



import jwt from "jsonwebtoken";

const generateToken = (res, userId, role) => {
    const token = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d" // ✅ Changed to 7 days
        }
    );
    
    // ✅ Still set cookie for backwards compatibility
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
    });

    // ✅ Return token so it can be sent in response body
    return token;
}

export default generateToken;