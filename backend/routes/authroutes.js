import express from 'express';
import { 
  signup, 
  login, 
  getProfile, 
  updateProfile 
} from '../controllers/authcontroller.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
console.log("🔥 Fichier authroutes.js chargé !");
console.log("📦 signup:", typeof signup);
console.log("📦 login:", typeof login);
console.log("📦 getProfile:", typeof getProfile);

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile/:id',authMiddlewares, getProfile);
router.put('/profile/:id',authMiddlewares, updateProfile);

console.log("✅ Toutes les routes définies !");

export default router;