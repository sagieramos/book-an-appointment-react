import './App.css';
import { Route, Routes } from 'react-router-dom';
import Vehicles from './components/Vehicles';
import CarDetails from './components/CarDetails';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Vehicles />} />
        <Route  path="/details/:id" element={<CarDetails />} />
      </Routes>
    </div>
  );
}

export default App;
