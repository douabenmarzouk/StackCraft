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
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(
      `${API_URL}/auth/login`,
      formData,
      { withCredentials: true }
    );

    const data = response.data;
    console.log("📦 Réponse login complète:", data);

    if (data.success) {
      setSuccess("Connexion réussie ! Redirection...");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user?._id) {
        localStorage.setItem("userId", data.user._id);
      }

      localStorage.setItem("userData", JSON.stringify(data));

      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setError(data.message || "Erreur de connexion");
    }
  } catch (err) {
    console.error("❌ Erreur login:", err);
    setError("Impossible de se connecter au serveur");
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
