import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TechStackCatalog, UserTechStack } from "../models/project.js";
dotenv.config();
// Normaliser le job : "Data Science" -> "data-science"
const normalizeJob = (job) => job.toLowerCase().replace(/\s+/g, '-');

// ============================================
// SIGNUP
// ============================================
export async function signup(req, res) {
  try {
    const { firstName, lastName, email, company, password, job } = req.body;
    
    if (!firstName || !lastName || !email || !password || !job) {
      return res.status(400).json({ 
        success: false, 
        message: "Veuillez remplir tous les champs obligatoires" 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Email déjà utilisé" 
      });
    }

    // Normaliser le job
    const normalizedJob = normalizeJob(job);
    const allowedJobs = ['devops', 'frontend', 'backend', 'cybersecurity', 'data-science'];
    
    if (!allowedJobs.includes(normalizedJob)) {
      return res.status(400).json({ 
        success: false, 
        message: `Job invalide. Jobs autorisés: ${allowedJobs.join(', ')}` 
      });
    }

    console.log("🔍 Job normalisé:", normalizedJob);

    // Récupérer le catalogue
    const catalog = await TechStackCatalog.findOne({ job: normalizedJob });
    
    if (!catalog) {
      const allCatalogs = await TechStackCatalog.find();
      console.log("❌ Catalogue introuvable pour:", normalizedJob);
      console.log("📚 Catalogues disponibles:", allCatalogs.map(c => c.job));
      
      return res.status(500).json({ 
        success: false, 
        message: "Catalogue introuvable",
        debug: {
          searchedJob: normalizedJob,
          availableJobs: allCatalogs.map(c => c.job)
        }
      });
    }

    console.log("✅ Catalogue trouvé pour:", normalizedJob);

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      company,
      job: normalizedJob,
      password
    });

    console.log("✅ Utilisateur créé:", user._id);

    // Créer la tech stack
    const userTechStack = await UserTechStack.create({
      userId: user._id,
      job: normalizedJob,
      selectedTechnologies: catalog.categories,
      expertise: new Map(),
      experience: new Map(),
      isComplete: false
    });
     // Générer le JWT directement après signup
    const token = jwt.sign({ id: user._id, email: user.email, job: user.job }, process.env.JWT_SECRET, { expiresIn: "30d" });


    console.log("✅ UserTechStack créé:", userTechStack._id);

    return res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        job: user.job
      },
      selectedTechnologies: userTechStack.selectedTechnologies,
      availableTechnologies: catalog.categories,
      expertise: {},
      experience: {},
      isComplete: false
    });

  } catch (error) {
    console.error("❌ Erreur signup:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur", 
      error: error.message 
    });
  }
}

// ============================================
// GET PROFILE
// ============================================
// ============================================
// GET PROFILE (avec support du job)
// ============================================
export async function getProfile(req, res) {
  try {
    const userId = req.params.id;
    console.log("🪪 ID reçu:", userId);

    // 1️⃣ Cherche l'utilisateur sans les champs sensibles
    const user = await User.findById(userId).select(
      "-password -authProvider -isEmailVerified -createdAt -updatedAt -__v  -id"
    );
    if (!user) {
      console.log("⚠️ Utilisateur introuvable");
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    console.log("✅ Utilisateur trouvé:", user.email);

    // 2️⃣ Récupère la stack technique liée à ce user
    const userTechStack = await UserTechStack.findOne({ userId: user._id });
    if (!userTechStack) {
      console.log("⚠️ Aucune stack trouvée pour:", user.email);
      return res.status(200).json({
        success: true,
        message: "Utilisateur trouvé mais aucune stack associée",
        user,
        selectedTechnologies: {},
        availableTechnologies: {},
        expertise: {},
        experience: {},
        isComplete: false
      });
    }

    // 3️⃣ Récupère le catalogue selon son métier
    const catalog = await TechStackCatalog.findOne({ job: user.job });
    console.log("📚 Catalogue trouvé:", catalog ? "OUI" : "NON");

    // 4️⃣ Retour complet
    return res.status(200).json({
      success: true,
      user,
      selectedTechnologies: userTechStack.selectedTechnologies || {},
      availableTechnologies: catalog?.categories || {},
      expertise: Object.fromEntries(userTechStack.expertise || []),
      experience: Object.fromEntries(userTechStack.experience || []),
      isComplete: userTechStack.isComplete
    });
  } catch (error) {
    console.error("❌ Erreur getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
}


// 2. CONNEXION CLASSIQUE (LOGIN)
// ============================================
// ============================================
// 2. CONNEXION CLASSIQUE (LOGIN)
// ============================================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Veuillez fournir email et mot de passe" 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect" 
      });
    }

    if (user.isAuthUser()) {
      return res.status(400).json({
        success: false,
        message: `Ce compte utilise l'authentification ${user.authProvider}. Veuillez vous connecter avec ${user.authProvider}.`
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Récupérer la tech stack de l'utilisateur
    const userTechStack = await UserTechStack.findOne({ userId: user._id });

    // Récupérer le catalogue complet selon le job
    const catalog = await TechStackCatalog.findOne({ job: user.job.toLowerCase() });
    const token = jwt.sign({ id: user._id, email: user.email, job: user.job }, process.env.JWT_SECRET, { expiresIn: "30d" });


    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        email: user.email,
        company: user.company,
        job: user.job,
        profilePicture: user.profilePicture,
        isAuthUser: user.isAuthUser()
      },
      // Technologies sélectionnées par l'utilisateur
      selectedTechnologies: userTechStack?.selectedTechnologies || null,
      // Catalogue complet des technologies disponibles
      availableTechnologies: catalog?.categories || null,
      expertise: userTechStack?.expertise || {},
      experience: userTechStack?.experience || {},
      isComplete: userTechStack?.isComplete || false
    });

  } catch (error) {
    console.error("❌ Erreur dans login:", error.message);
    return res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
}
// ============================================
// 5. METTRE À JOUR LE PROFIL
// ============================================
export async function updateProfile(req, res) {
  try {
    const userId=req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }
    // Mise à jour des champs autorisés
    if (req.body.company) user.company = req.body.company;
    if(req.body.email)  user.email=req.body.email;
    if(req.body.job)  user.job=req.body.job;
    if (req.body.job) {
      const allowedJobs = ['devops', 'frontend', 'backend', 'cybersecurity', 'Data Science'];
      if (allowedJobs.includes(req.body.job)) {
        user.job = req.body.job;
      }
    }
    // Mise à jour du mot de passe (seulement pour comptes classiques)
    if (req.body.password) {
      if (user.isAuthUser()) {
        return res.status(400).json({
          success: false,
          message: "Impossible de modifier le mot de passe pour un compte OAuth"
        });
      }
      if (req.body.password.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: "Le mot de passe doit contenir au moins 6 caractères" 
        });
      }

      // ✅ Sera hashé automatiquement par le pre-save hook
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.getFullName(),
        email: updatedUser.email,
        company: updatedUser.company,
        job: updatedUser.job,
        profilePicture: updatedUser.profilePicture,
        authProvider: updatedUser.authProvider,
        isAuthUser: updatedUser.isAuthUser(),
        updatedAt: updatedUser.updatedAt
      },
    });

  } catch (error) {
    console.error("❌ Erreur dans updateProfile:", error.message);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "Cet email est déjà utilisé par un autre compte" 
      });
    }
    return res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
}