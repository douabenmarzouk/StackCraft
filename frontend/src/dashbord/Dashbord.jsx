import React, { useState, useEffect } from 'react';
import { User, Briefcase, Mail, Building2, LogOut, Settings, ChevronDown, Code, Cpu, Sparkles, CheckCircle2, Circle } from 'lucide-react';

const Dashbord = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableTechnologies, setAvailableTechnologies] = useState({});
  const [selectedTechnologies, setSelectedTechnologies] = useState({});
  const [projects, setProjects] = useState([]);
  const [generatingProjects, setGeneratingProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('technologies');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      console.log('🔍 Token:', token ? 'Existe' : 'Non trouvé');
      console.log('🔍 UserId:', userId);

      if (!token || !userId) {
        console.error('❌ Pas de token ou userId');
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/Login';
        return;
      }

      const response = await fetch(`http://localhost:5001/api/auth/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📦 Réponse profil:', data);
      
      if (data.success) {
        setUser(data.user);
        setAvailableTechnologies(data.availableTechnologies || {});
        setSelectedTechnologies(data.selectedTechnologies || {});
        console.log('✅ Profil chargé avec succès');
      } else {
        console.error('❌ Échec du chargement du profil:', data.message);
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Erreur fetch profil:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleTechToggle = (category, tech) => {
    setSelectedTechnologies(prev => {
      const categoryTechs = prev[category] || [];
      const isSelected = categoryTechs.includes(tech);
      
      return {
        ...prev,
        [category]: isSelected
          ? categoryTechs.filter(t => t !== tech)
          : [...categoryTechs, tech]
      };
    });
  };

  const handleSaveTechnologies = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('💾 Sauvegarde des technologies...');
      console.log('📦 Technologies sélectionnées:', selectedTechnologies);

      const response = await fetch('http://localhost:5001/api/project/update-tech-stack', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          selectedTechnologies
        })
      });

      const data = await response.json();
      console.log('📦 Réponse sauvegarde:', data);
      
      if (response.ok) {
        alert('✅ Technologies sauvegardées avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.error || data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde technologies:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleGenerateProjects = async () => {
    try {
      setGeneratingProjects(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('🤖 Génération de projets...');

      const response = await fetch('http://localhost:5001/api/ai/generate-projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      console.log('📦 Réponse IA:', data);
      
      if (data.success) {
        setProjects(data.ideas);
        setActiveTab('projects');
        alert('✅ Projets générés avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.error || data.message || 'Erreur génération'));
      }
    } catch (error) {
      console.error('❌ Erreur génération projets:', error);
      alert('❌ Erreur lors de la génération des projets');
    } finally {
      setGeneratingProjects(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  const getJobLabel = (job) => {
    const jobLabels = {
      'devops': 'DevOps',
      'frontend': 'Frontend Developer',
      'backend': 'Backend Developer',
      'cybersecurity': 'Cybersecurity',
      'data-science': 'Data Science'
    };
    return jobLabels[job] || job;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'débutant': 'bg-green-100 text-green-700',
      'intermédiaire': 'bg-yellow-100 text-yellow-700',
      'avancé': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-gray-600 mb-4">Impossible de charger le profil. Veuillez vous reconnecter.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const selectedCount = Object.values(selectedTechnologies).flat().filter(t => t).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">TechStack Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Paramètres</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pb-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{getJobLabel(user.job)}</span>
            </div>
            {user.company && (
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-green-500" />
                <span>{user.company}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Technologies sélectionnées</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{selectedCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Poste</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{getJobLabel(user.job)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Projets générés</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('technologies')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'technologies'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Technologies</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'projects'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Projets IA</span>
              </div>
            </button>
          </div>
        </div>

        {/* Technologies Tab */}
        {activeTab === 'technologies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Sélectionnez vos technologies</h2>
                <button
                  onClick={handleSaveTechnologies}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              {Object.keys(availableTechnologies).length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune technologie disponible pour ce poste.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(availableTechnologies).map(([category, techs]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {techs.map((tech) => {
                          const isSelected = selectedTechnologies[category]?.includes(tech);
                          return (
                            <button
                              key={tech}
                              onClick={() => handleTechToggle(category, tech)}
                              className={`p-3 rounded-lg border-2 transition flex items-center space-x-2 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm font-medium">{tech}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCount > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Prêt à générer des projets ?</h3>
                    <p className="text-sm opacity-90">Utilisez l'IA pour obtenir des suggestions de projets basées sur vos technologies</p>
                  </div>
                  <button
                    onClick={handleGenerateProjects}
                    disabled={generatingProjects}
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{generatingProjects ? 'Génération...' : 'Générer des projets'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Projets suggérés par l'IA</h2>
            
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucun projet généré pour le moment</p>
                <button
                  onClick={handleGenerateProjects}
                  disabled={generatingProjects || selectedCount === 0}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {generatingProjects ? 'Génération...' : 'Générer des projets'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{project.titre}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulte)}`}>
                        {project.difficulte}
                      </span>
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                ))}
                
                <button
                  onClick={handleGenerateProjects}
                  disabled={generatingProjects}
                  className="w-full mt-4 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
                >
                  {generatingProjects ? 'Génération...' : 'Générer de nouveaux projets'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashbord;