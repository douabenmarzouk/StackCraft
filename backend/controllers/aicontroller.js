import axios from "axios";
import dotenv from "dotenv";
import { UserTechStack } from "../models/project.js";

dotenv.config();

export async function generateProjectByUser(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const userTech = await UserTechStack.findOne({ userId });
    if (!userTech) return res.status(404).json({ error: "User not found" });

    const job = userTech.job;
    const techsList = Object.values(userTech.selectedTechnologies)
      .flat()
      .filter(t => t);

    const prompt = `Tu es un expert en ${job}.
Voici les technologies : ${techsList.join(", ")}.
Suggère 3 projets réalistes.

Réponds avec un objet JSON :
{
  "projets": [
    {
      "titre": "...",
      "description": "...",
      "difficulte": "débutant ou intermédiaire ou avancé"
    }
  ]
}`;

    // Appel Mistral AI
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Vérifie si le contenu existe
    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: "Aucun contenu renvoyé par Mistral AI" });
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      return res.status(500).json({ error: "Impossible de parser le JSON de Mistral AI", raw: content });
    }

    res.status(200).json({ success: true, ideas: result.projets || [] });

  } catch (error) {
    console.error("Erreur Mistral AI:", error.response?.data || error.message);
    // Toujours renvoyer du JSON même si Mistral AI échoue
    res.status(500).json({
      error: "Erreur Mistral AI",
      details: error.response?.data || error.message
    });
  }
}
