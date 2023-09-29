import morgan from "morgan";
import connectDB from "./../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import chatRouter from "./modules/chat/chat.router.js";
import messageRouter from "./modules/message/message.router.js";
import connectSocket from "./socket.js";

const appRouter = (app, express, server) => {
  // morgan >> information about each request
  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
  }

  // socket
  connectSocket(server);

  connectDB();

  // parse the buffer data
  app.use(express.json());

  // Routes
  app.use("/auth", authRouter);

  app.use("/user", userRouter);

  app.use("/chat", chatRouter);

  app.use("/message", messageRouter);

  app.all("*", (req, res, next) => {
    return next(new Error("Page not found!", { cause: 404 }));
  });

  // Global error Handler
  app.use((error, req, res, next) => {
    return res.status(error.cause || 500).json({
      success: false,
      message: error.message,
      error,
      stack: error.stack,
    });
  });
};

export default appRouter;
