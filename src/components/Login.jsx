import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser } from '../redux/slices/profileSlice';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.profile);
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const msg = error || '';

  return (
    <div className="login-container-wrapperr">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p>{msg}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="login"
            placeholder="Username or Email"
            value={credentials.login}
            onChange={handleChange}
          />
          <div className="show-password">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
            />
            <div
              onClick={toggleShowPassword}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleShowPassword();
                }
              }}
              role="button"
              tabIndex={0}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <button type="submit" disabled={loading}>
            Log In
          </button>
          <p>
            Don&apos;t have an accout? &nbsp;
            <button type="button" onClick={() => { navigate('/signup'); }}>Sign Up</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
