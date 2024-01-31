import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../redux/slices/profileSlice';
import './Registration.css';

const Registration = () => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const { loading, error, user } = useSelector((state) => state.profile);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      newErrors.email = 'Invalid email format';
    } if (userDetails.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (userDetails.password !== userDetails.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    } if (userDetails.username.length < 3 || userDetails.username.toLowerCase() === 'users') {
      newErrors.username = 'Invalid username';
    } setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signupUser(userDetails));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const msg = error || '';

  return (
    <div className="registration-wrapper">
      <div className="registration">
        <h2>Registration</h2>
        {loading && (
        <div>
          <div>
            <div />
            <p>Loading...</p>
          </div>
        </div>
        )}
        {error && <p>{msg}</p>}
        <form onSubmit={handleRegistration}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userDetails.username}
            onChange={handleChange}
          />
          {errors.username && <span>{errors.username}</span>}
          <input type="text" name="firstName" placeholder="First Name" value={userDetails.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last Name" value={userDetails.lastName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={userDetails.email} onChange={handleChange} />
          {errors.email && <span>{errors.email}</span>}
          <select name="city" value={userDetails.city} onChange={handleChange}>
            <option value="">Select City</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password}</span>}
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            value={userDetails.passwordConfirmation}
            onChange={handleChange}
          />
          {errors.passwordConfirmation && <span>{errors.passwordConfirmation}</span>}
          <button type="submit">Register</button>
          <p className="al-q">
            Already have an accout?
            <button type="button" onClick={() => { navigate('/login'); }}>Log In</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
