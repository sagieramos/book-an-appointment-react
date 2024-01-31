import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaFacebook, FaTwitter, FaLinkedin, FaGithub,
} from 'react-icons/fa';

import {
  Routes, Route, NavLink, useLocation,
} from 'react-router-dom';
import Login from './components/Login';
import { logoutUser, me } from './redux/slices/profileSlice';
import Registration from './components/Registration';
import Vehicles from './components/Vehicles';
import ItemForm from './components/ItemForm';
import ItemDetails from './components/ItemDetails';
import ReservationsList from './components/ReservationList';
import ReservationDetails from './components/ReservationDetails';
import myLogo from './assets/cars.jpg';

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
      <div className="app-container">
        <div className="app-color app-color-1" />
        <div className="app-color app-color-2" />
        <div className="app-color app-color-3" />
        <header className="App-header">
          <div className="img-container">
            <img src={myLogo} alt="brand-logo" />
          </div>
          <nav className="nav">
            <NavLink to="/">Vehicles</NavLink>
            {!alreadyLogin && <NavLink to="/login">Login</NavLink>}
            {!alreadySignup && <NavLink to="/signup">Signup</NavLink>}
            {user?.admin && <NavLink to="/items/new">Add New Car</NavLink>}
            {user && <NavLink to={`/${user?.username}/reservations`}>My Reservations</NavLink>}
            {user && <button type="button" onClick={handleLogout} className="log-out-btn">Logout</button>}
          </nav>

          {loading && <div>Loading...</div>}
          <div className="app-social">
            <div><FaFacebook size={22} color="#3b5998" /></div>
            <div><FaTwitter size={22} color="#1da1f2" /></div>
            <div><FaLinkedin size={22} color="#0077b5" /></div>
            <div><FaGithub size={22} color="#171515" /></div>
          </div>
        </header>

        <div className="App-content">
          <Routes>
            <Route path="/" element={<Vehicles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            {user?.username && <Route path="/items/new" element={<ItemForm />} />}
            <Route path="/item/:id" element={<ItemDetails />} />
            {user?.username && (
            <>
              <Route path="/:username/reservations" element={<ReservationsList />} />
              <Route path="/:username/reservations/:id" element={<ReservationDetails />} />
              <Route path="/:username/item/:id" element={<ItemDetails />} />
            </>
            ) }
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
