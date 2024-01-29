import './App.css';
import { Route, Routes } from 'react-router-dom';
import Vehicles from './components/Vehicles';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Vehicles />} />
      </Routes>
    </div>
  );
}

export default App;
