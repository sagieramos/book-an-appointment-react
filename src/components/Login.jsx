import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser } from '../redux/slices/profileSlice';
import style from './Authentication.module.css';

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
    <div className={style['section-auth-container']}>
      <div className={`${style.color} ${style['color-1']}`} />
      <div className={`${style.color} ${style['color-2']}`} />
      <div className={`${style.color} ${style['color-3']}`} />
      <div className={style.box}>
        <div className={style.container}>
          <h2 className={style.heading}>Login Form</h2>
          {loading && (
            <div>
              <p className={style['color-color']}>Loading...</p>
            </div>
          )}
          {/* {loading && (
            <div className={style['modal-overlay']}>
              <div className={style['modal-content']}>
                <div className={style['spinner']}></div>
                <p className={style['loading-message']}>Loading...</p>
              </div>
            </div>
          )} */}
          {error && <p className={style['error-msg']}>{msg}</p>}
          <form onSubmit={handleLogin} className={style.form}>
            <input
              type="text"
              name="login"
              placeholder="Username or Email"
              value={credentials.login}
              onChange={handleChange}
            />
            <div className={style['input-container']}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <div
                className={style['password-toggle']}
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
            <button type="submit" disabled={loading} className={style['submit-btn']}>
              Log In
            </button>
            <p>
              Don`&apos;`t have an accout?
              <button type="button" onClick={() => { navigate('/signup'); }}>Sign Up</button>
            </p>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Login;
