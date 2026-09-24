import express from "express";
import morgan from "morgan";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(indexRoutes);
app.use(usersRoutes);
app.use(authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
