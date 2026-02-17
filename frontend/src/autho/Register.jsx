// Register.jsx - VERSION DEBUG SIMPLIFIÉE
import { useState } from "react";
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
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDebugInfo("");
    setLoading(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const endpoint = `${API_URL}/auth/signup`;


    console.log('=== DÉBUT INSCRIPTION ===');
    console.log('1. URL:', endpoint);
    console.log('2. Données:', formData);
    setDebugInfo(`Envoi vers: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('3. Status HTTP:', response.status);
      console.log('4. Status Text:', response.statusText);
      setDebugInfo(prev => `${prev}\nStatus: ${response.status}`);

      // Lire la réponse comme texte d'abord
      const responseText = await response.text();
      console.log('5. Réponse brute:', responseText);
      setDebugInfo(prev => `${prev}\nRéponse: ${responseText.substring(0, 100)}`);

      // Essayer de parser en JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('6. Données parsées:', data);
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError);
        setError('Le serveur a renvoyé une réponse invalide');
        setDebugInfo(prev => `${prev}\nErreur parsing: ${parseError.message}`);
        return;
      }

      // Vérifier le succès
      if (data.success) {
        console.log('✅ INSCRIPTION RÉUSSIE');
        setSuccess("Inscription réussie ! Redirection...");

        // Sauvegarder les données
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log('✅ Token sauvegardé');
        } else {
          console.warn('⚠️ Pas de token dans la réponse');
        }

        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user._id);
          console.log('✅ UserId sauvegardé');
        } else {
          console.warn('⚠️ Pas de user._id dans la réponse');
        }

        // Sauvegarder userData complet
        const userData = {
          user: data.user || {},
          selectedTechnologies: data.selectedTechnologies || [],
          availableTechnologies: data.availableTechnologies || [],
          expertise: data.expertise || {},
          experience: data.experience || {},
          isComplete: data.isComplete || false
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log('✅ UserData sauvegardé');

        // Vider le formulaire
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          job: "",
          company: "",
          password: ""
        });

        // Redirection
        setTimeout(() => {
          navigate('/Dashbord');
        }, 2000);
      } else {
        console.log('❌ Échec:', data.message);
        setError(data.message || "Erreur lors de l'inscription");
      }

    } catch (err) {
      console.error('❌ ERREUR COMPLÈTE:', err);
      console.error('Type:', err.constructor.name);
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
      
      setError(`Erreur: ${err.message}`);
      setDebugInfo(prev => `${prev}\nErreur: ${err.message}`);
    } finally {
      setLoading(false);
      console.log('=== FIN INSCRIPTION ===');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-purple-700 mb-2">💡 Project Ideas</h1>
          <p className="text-gray-500">Créez votre compte pour explorer des idées innovantes</p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-xs font-mono whitespace-pre-wrap">
            <strong>DEBUG:</strong><br/>{debugInfo}
          </div>
        )}

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
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="job"
              value={formData.job}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            minLength="6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg transition disabled:opacity-50"
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

        {/* Instructions de debug */}
        <div className="mt-6 p-4 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Ouvrez la console (F12) pour voir les logs détaillés
        </div>
      </div>
    </div>
  );
}

export default Register;