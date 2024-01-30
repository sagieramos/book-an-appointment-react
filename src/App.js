import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes, Route, Link, useLocation,
} from 'react-router-dom';
import Login from './components/Login';
import { logoutUser, me } from './redux/slices/profileSlice';
import Registration from './components/Registration';
import Vehicles from './components/Vehicles';
import ItemForm from './components/ItemForm';
import ItemDetails from './components/ItemDetails';
import ReservationsList from './components/ReservationList';
import ReservationDetails from './components/ReservationDetails';

const App = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.profile);
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      throw new Error(error.response?.data?.status?.message || 'Logout failed');
    }
  };

  if (error) {
    return (
      <p>
        Error:
        {error}
      </p>
    );
  }

  const alreadyLogin = pathname === '/login' || user;
  const alreadySignup = pathname === '/signup' || user;
  return (
    <div className="App">
      <header className="App-header">
        <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/">Vehicles</Link>
          {!alreadyLogin && <Link to="/login">Login</Link>}
          {!alreadySignup && <Link to="/signup">Signup</Link>}
          <Link to="/items/new">Add Item</Link>
          {user && <Link to={`/${user?.username}/reservations`}>Reservations</Link>}
          {user && <button type="button" onClick={handleLogout}>Logout</button>}
        </nav>

        {loading && <div>Loading...</div>}
      </header>

      <Routes>
        <Route path="/" element={<Vehicles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/items/new" element={<ItemForm />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/:username/reservations" element={<ReservationsList />} />
        <Route path="/:username/reservations/:id" element={<ReservationDetails />} />
      </Routes>
    </div>
  );
};

export default App;
