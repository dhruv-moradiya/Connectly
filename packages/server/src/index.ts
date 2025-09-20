// import "@monorepo/shared/src/types";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { httpServer } from "./app";
import connectDB from "./db";
import { logger } from "./utils";

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;

    httpServer.listen(PORT, async () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, "❌ Database connection failed");
    process.exit(1);
  }
}

startServer();
