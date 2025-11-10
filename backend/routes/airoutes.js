import express from "express";
import { generateProjectByUser} from "../controllers/aicontroller.js";
const router=express.Router();
router.post("/generate-projects", generateProjectByUser);
export default router;