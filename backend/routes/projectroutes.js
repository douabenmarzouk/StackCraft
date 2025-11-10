 import express from "express";
 import {
    getTechnologiesByJob,
    updateUserTechStack,
 }from "../controllers/projectcontroller.js";
import { authMiddlewares } from "../middlewares/authMiddlewares.js";
 const router=express.Router();
 router.get("/technologie",getTechnologiesByJob);
 router.put("/technologie",authMiddlewares,updateUserTechStack);
 export default router;