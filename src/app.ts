import cors from "cors";
import express from "express";
import helmet from "helmet";

import Config from "./config/config";
import { connectDB } from "./config/db";
import {
  errorHandler,
  routeNotFoundHandler,
} from "./middlewares/error.middleware";
import appRouter from "./routes/index.routes";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", appRouter);

app.use(routeNotFoundHandler);

app.use(errorHandler);

app.listen(Config.serverPort, async () => {
  await connectDB();
  console.log(`Server is running on port ${Config.serverPort}`);
});
