import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import { AUTH_SECRET, NODE_ENV } from "./config/env.js";

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: NODE_ENV === "production",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesión
app.use(
  session({
    secret: AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Rutas
app.use("/api", routes);

export default app;
