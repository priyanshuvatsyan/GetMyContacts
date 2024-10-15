 // Importing the Navbar component
import './App.css';  // Importing the App.css file for styling
import Hero from './assets/Hero/Hero.jsx';  // Assuming this is your home/landing component
import AddContact from './assets/Add Contact/AddContact.jsx';
import Login from './assets/Login/Login.jsx';  // Corrected: Changed login to Login
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/hero" element={<Hero />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
