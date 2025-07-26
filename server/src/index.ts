import dotenv from "dotenv";
import { httpServer } from "./app";
import connectDB from "./db";

dotenv.config({
  path: ".env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`😍 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("❌ Database connection failed");
    process.exit(1);
  });
