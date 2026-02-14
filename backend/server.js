import express from "express";
import dotenv from "dotenv";
import { seedTechStackCatalog } from './models/project.js';
import { connectDB } from "./config/bd.js";
import cors from 'cors';
import authroutes from "./routes/authroutes.js";
import airoutes from "./routes/airoutes.js";
import projectroutes from "./routes/projectroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 DEBUG - Affiche les valeurs
console.log("🔍 DEBUG: process.env.PORT =", process.env.PORT);
console.log("🔍 DEBUG: Type de authroutes:", typeof authroutes);
console.log("deploy test")

// Middleware pour parser le JSON
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
console.log("🔍 DEBUG: Enregistrement des routes /api/auth");
app.use("/api/auth", authroutes);
app.use("/api/project", projectroutes);
app.use("/api/ai", airoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("API fonctionne !");
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Connexion à la base de données et seeding
connectDB()
  .then(async () => {
    console.log('✅ Base de données connectée');
    await seedTechStackCatalog();
    console.log('✅ Seeding terminé');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion ou de seeding:', error);
    process.exit(1);
  });

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`\n📍 Routes disponibles :`);
  console.log(`   GET http://localhost:${PORT}/`);
  console.log(`   GET http://localhost:${PORT}/health`);
  console.log(`   PUT http://localhost:${PORT}/api/project/technologie`);
  console.log(`\n`);
});