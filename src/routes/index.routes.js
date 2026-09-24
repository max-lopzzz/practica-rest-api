import { Router } from "express";
import { home, marco, ping } from "../controllers/index.controller.js";

const router = Router();

router.get("/", home);
router.get("/marco", marco);
router.get("/ping", ping);

export default router;
