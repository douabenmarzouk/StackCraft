// Register.jsx - CORRIGÉ
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    job: "",
    company: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try { const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = response.data;

      console.log('📦 Réponse signup complète:', data);

      if (data.success) {
        setSuccess("Inscription réussie ! Redirection...");

        // ✅ SAUVEGARDER LE TOKEN ET USER ID (REQUIS POUR LE DASHBOARD)
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log('✅ Token sauvegardé:', data.token);
        } else {
          console.warn('⚠️ Pas de token dans la réponse signup !');
        }

        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user._id);
          console.log('✅ UserId sauvegardé:', data.user._id);
        } else {
          console.warn('⚠️ Pas de user._id dans la réponse signup !');
        }

        // ✅ SAUVEGARDER LES DONNÉES UTILISATEUR (OPTIONNEL)
        const userData = {
          user: data.user,
          selectedTechnologies: data.selectedTechnologies,
          availableTechnologies: data.availableTechnologies,
          expertise: data.expertise,
          experience: data.experience,
          isComplete: data.isComplete,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log('✅ UserData sauvegardé');

        // Vérification finale
        console.log('🔍 Vérification localStorage:');
        console.log('  - Token:', localStorage.getItem('token') ? 'OK' : 'MANQUANT');
        console.log('  - UserId:', localStorage.getItem('userId') ? 'OK' : 'MANQUANT');
        console.log('  - UserData:', localStorage.getItem('userData') ? 'OK' : 'MANQUANT');

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          job: "",
          company: "",
          password: ""
        });

        // Redirection vers dashboard
        setTimeout(() => {
          navigate('/Dashbord');
        }, 1500);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error('❌ Erreur signup:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Impossible de se connecter au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl transform hover:scale-105 transition duration-500">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-purple-700 mb-2">💡 Project Ideas</h1>
          <p className="text-gray-500">Créez votre compte pour explorer des idées innovantes</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">Erreur:</strong> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">Succès:</strong> {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />

          <div className="grid grid-cols-2 gap-4">
             <select
              name="job"
              value={formData.job}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
              required
            >
              <option value="">Sélectionnez votre domaine</option>
              <option value="devops">DevOps</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="data-science">Data Science</option>
            </select>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Entreprise (optionnel)"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
            minLength="6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{" "}
            <a href="/login" className="text-purple-700 font-bold hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;