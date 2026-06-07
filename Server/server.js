import dotenv from "dotenv";
dotenv.config();


// import app from "./src/app.js";
// import app from "./src/app.js";
import server from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();
