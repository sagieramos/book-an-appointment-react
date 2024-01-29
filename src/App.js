import React, { useEffect, useState } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import store from './redux/store';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import { loginUser, logoutUser } from './redux/slices/profileSlice';
import url from './apiDomain.json';
import Registration from './components/Registration';
import Vehicles from './components/Vehicles';



const App = () => {
  const dispatch = useDispatch();
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  async function fetchUserProfile(authToken) {
    const res = await fetch(`${url.apiDomain}/api/v1/users/my_profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
    });
    if (res.status === 200) {
      const userData = await res.json();
      store.dispatch(loginUser(userData.data));
    }
  }

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const authToken = localStorage.getItem('authorization_token');
        if (authToken) {
          await fetchUserProfile(authToken);
        }
      } catch (error) {
        throw new Error(error.response?.data?.status?.message || 'Logout failed');
      }
    };
    checkUserSession();
  }, []);
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setLogoutSuccess(true);
      setTimeout(() => {
        setLogoutSuccess(false);
      }, 3000);
    } catch (error) {
      throw new Error(error.response?.data?.status?.message || 'Logout failed');
    }
  };

  const { user } = useSelector((state) => state.profile);
  const { pathname } = useLocation();
  const alreadyLogin = pathname === '/login' || user;
  const alreadySignup = pathname === '/signup' || user;
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/">Vehicles</Link>
          {!alreadyLogin && <Link to="/login">Login</Link>}
          {user && <button onClick={handleLogout}>Logout</button>}
          {!alreadySignup && <Link to="/signup">Signup</Link>}
        </nav>
        {logoutSuccess && (
          <div className="logout-success-message">
            Logout successful! Redirecting...
          </div>
        )}

      </header>
      
      <Routes>
        <Route path="/" element={<Vehicles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        
      </Routes>
    </div>
  );
}

export default App;