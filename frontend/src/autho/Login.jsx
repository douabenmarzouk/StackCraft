// Login.jsx - CORRIGÉ
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      const data = response.data;
      
      console.log('📦 Réponse login complète:', data);
      
      if (data.success) {
        setSuccess("Connexion réussie ! Redirection...");

        // ✅ SAUVEGARDER LE TOKEN ET USER ID (REQUIS POUR LE DASHBOARD)
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log('✅ Token sauvegardé:', data.token);
        } else {
          console.warn('⚠️ Pas de token dans la réponse !');
        }

        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user._id);
          console.log('✅ UserId sauvegardé:', data.user._id);
        } else {
          console.warn('⚠️ Pas de user._id dans la réponse !');
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

        setFormData({ email: "", password: "" });
        
        // Redirection vers dashboard
        setTimeout(() => {
          navigate('/Dashbord');
        }, 1500);
      } else {
        setError(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error('❌ Erreur login:', err);
      setError(err.response?.data?.message || "Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg transform hover:scale-105 transition duration-500">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-purple-700 mb-2">💡 Project Ideas</h1>
          <p className="text-gray-500">Connectez-vous pour explorer des idées innovantes</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-purple-700 font-bold hover:underline">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;