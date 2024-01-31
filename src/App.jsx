import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaFacebook, FaTwitter, FaLinkedin, FaGithub,
} from 'react-icons/fa';
import { RotateLoader } from 'react-spinners';

import {
  Routes, Route, NavLink,
} from 'react-router-dom';
import Login from './components/Login';
import { logoutUser, me } from './redux/slices/profileSlice';
import Registration from './components/Registration';
import Vehicles from './components/Vehicles';
import ItemForm from './components/ItemForm';
import ItemDetails from './components/ItemDetails';
import ReservationsList from './components/ReservationList';
import ReservationDetails from './components/ReservationDetails';
import myLogo from './assets/images/logocar.png';




const App = () => {
  const dispatch = useDispatch();
  const { profile, items, reservations } = useSelector((state) => state);
  const { user, loading, error } = profile;

  const stillLoading = items.loading || reservations.loading || loading;

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

  return (
    <div className="App">
      {stillLoading
      && <div className="spinner"><RotateLoader color="#98bf11" /></div>}
      <header className="App-header">
        <div className="img-container">
          <img src={myLogo} alt="brand-logo" />
        </div>
        <nav className="nav">
          <NavLink to="/">Vehicles</NavLink>
          {!user
            && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
            )}
          {user?.admin && <NavLink to="/items/new">Add New Car</NavLink>}
          {user && <NavLink to={`/${user?.username}/reservations`}>Reservations</NavLink>}
          {user && <button type="button" onClick={handleLogout} className="log-out-btn">Logout</button>}
        </nav>

        {loading && <div>Loading...</div>}
        <div className="app-social">
          <FaFacebook size={20} color="#3b5998" />
          <FaTwitter size={20} color="#1da1f2" />
          <FaLinkedin size={20} color="#0077b5" />
          <FaGithub size={20} color="#171515" />
        </div>
      </header>
      <main>
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
      </main>
    </div>
  );
};

export default App;
