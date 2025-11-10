import {TechStackCatalog , UserTechStack } from "../models/project.js"; // Adjust path to your models
import User from "../models/User.js"; // Ensure this path is correct
// URL: GET /technologies?job=backend
// URL: GET /api/project/technologies?job=backend
export async function getTechnologiesByJob(req, res) {
  try {
    const { job } = req.query; // récupération depuis l'URL

    if (!job || !['devops','frontend','backend','cybersecurity','data-science'].includes(job.toLowerCase())) {
      return res.status(400).json({ error: "Invalid or missing job role" });
    }

    const catalog = await TechStackCatalog.findOne({ job: job.toLowerCase() });
    if (!catalog) {
      return res.status(404).json({ error: `No technology catalog found for job: ${job}` });
    }
    return res.status(200).json({ 
      success: true,
      job: job.toLowerCase(),
      categories: catalog.categories
    });
  } catch (error) {
    console.error("Error fetching technologies by job:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// Update a user's technology stack
export async function updateUserTechStack(req, res) {
  try {
    const { userId, selectedTechnologies, expertise, experience } = req.body;
    // Validate inputs
    if (!userId || (!selectedTechnologies && !expertise && !experience)) {
      return res.status(400).json({ error: "Missing required fields: userId and at least one of selectedTechnologies, expertise, or experience" });
    }
   // Check if tech stack exists
    const userTechStack = await UserTechStack.findOne({ userId });
    if (!userTechStack) {
      return res.status(404).json({ error: "User tech stack not found" });
    }
    // Validate selected technologies against catalog
    if (selectedTechnologies) {
      const catalog = await TechStackCatalog.findOne({ job: userTechStack.job });
      if (!catalog) {
        return res.status(404).json({ error: `No technology catalog found for job: ${userTechStack.job}` });
      }
    }
    // Prepare update object
    const updateData = {};
    if (selectedTechnologies) {
      updateData.selectedTechnologies = { ...userTechStack.selectedTechnologies, ...selectedTechnologies };
    }
    if (expertise) {
      updateData.expertise = new Map([...userTechStack.expertise, ...Object.entries(expertise)]);
    }
    if (experience) {
      updateData.experience = new Map([...userTechStack.experience, ...Object.entries(experience)]);
    }
    updateData.lastModified = Date.now();

    // Update tech stack
    const updatedTechStack = await UserTechStack.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "User tech stack updated successfully", data: updatedTechStack });
  } catch (error) {
    console.error("Error updating user tech stack:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}