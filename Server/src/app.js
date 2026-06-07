// // import env from "dotenv";
// // env.config();

// // import express from "express";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";
// // import http from "http";
// // import { initSocket } from "./sockets/interview.Socket.js";

// // import authRoutes from "./routes/auth.routes.js";
// // // import adminRoutes from "./routes/admin/index.js";
// // import adminRoutes from "./routes/admin.routes.js";
// // import interviewRoutes from "./routes/interview.routes.js";
// // import reportRoutes from "./routes/report.routes.js";
// // import { apiLimiter } from "./middlewares/rateLimiter.js";

// // const app = express();

// // const server = http.createServer(app);

// // initSocket(server);

// // // Middlewares
// // app.use(express.json());
// // app.use(cookieParser());

// // // app.use(
// // //   cors({
// // //     origin: process.env.CLIENT_URL,
// // //     credentials: true,
// // //   })
// // // );

// // // CORS Configuration
// // const corsOptions = {
// //   origin: process.env.NODE_ENV === 'production' 
// //     ? process.env.CLIENT_URL 
// //     : 'http://localhost:5173',
// //   credentials: true
// // };

// // app.use(cors(corsOptions));

// // // Health check
// // app.get("/api/health", (req, res) => {
// //   res.status(200).json({ success: true, message: "API is running" });
// // });

// // app.use('/api/' ,apiLimiter);


// // app.use("/api/auth", authRoutes);
// // app.use("/api/admin", adminRoutes);
// // app.use('/api/interviews', interviewRoutes);
// // app.use('/api/reports', reportRoutes);

// // export default server;



// import env from "dotenv";
// env.config();

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import http from "http";
// import { initSocket } from "./sockets/interview.Socket.js";

// import authRoutes from "./routes/auth.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import interviewRoutes from "./routes/interview.routes.js";
// import reportRoutes from "./routes/report.routes.js";
// import { apiLimiter } from "./middlewares/rateLimiter.js";

// const app = express();

// const server = http.createServer(app);

// initSocket(server);

// // ✅ CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARES
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     const allowedOrigins = [
//       'http://localhost:5173',
//       'http://localhost:5174',
//       'http://localhost:3000',
//       process.env.CLIENT_URL
//     ].filter(Boolean);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(null, true); // For development, allow all. Change in production.
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
//   exposedHeaders: ['set-cookie']
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options('*', cors(corsOptions));

// // Other Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // Health check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ success: true, message: "API is running" });
// });

// // Rate limiting (apply after CORS)
// app.use('/api/', apiLimiter);

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/reports', reportRoutes);

// export default server;




import env from "dotenv";
env.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./sockets/interview.Socket.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

const server = http.createServer(app);

initSocket(server);

// ✅ CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARES
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://interviqa-ai.vercel.app',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For development, allow all. Change in production.
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// ❌ REMOVE THIS LINE - It causes the error
// app.options('*', cors(corsOptions));

// Other Middlewares
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Rate limiting (apply after CORS)
app.use('/api/', apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/reports', reportRoutes);

export default server;