// import "@monorepo/shared/src/types";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { httpServer } from "./app";
import connectDB from "./db";

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;

    httpServer.listen(PORT, async () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
