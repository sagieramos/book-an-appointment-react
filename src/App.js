import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Vehicles from './components/Vehicles';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/">Vehicles</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Vehicles />} />
      </Routes>
    </div>
  );
}
export default App; 