import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './autho/Login.jsx';
import './index.css';
import Register from './autho/Register.jsx';
import Dashboard from './dashbord/Dashbord.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/Dashbord" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
