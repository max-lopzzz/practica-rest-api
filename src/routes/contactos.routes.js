import { Router } from "express";
import { getContactos, createContacto } from "../controllers/contactos.controller.js";

const router = Router();

router.get("/contactos", getContactos);
router.post("/contactos", createContacto);

export default router;
