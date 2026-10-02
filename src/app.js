import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config.js";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactosRoutes from "./routes/contactos.routes.js";

const app = express();

app.use(morgan("dev"));
// Permite que una página publicada (p. ej. GitHub Pages) llame a la API en localhost
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use(indexRoutes);
app.use(usersRoutes);
app.use(authRoutes);
app.use(contactosRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
