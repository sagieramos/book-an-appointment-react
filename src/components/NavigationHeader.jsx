import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaFacebook, FaTwitter, FaLinkedin, FaGithub,
} from 'react-icons/fa';
import { logoutUser } from '../redux/slices/profileSlice';
import '../assets/style/hamburger.css';

const NavigationHeader = () => {
  const { user } = useSelector((state) => state.profile);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      navigate('/');
    } catch (error) {
      throw new Error(error.response?.data?.status?.message || 'Logout failed');
    }
  };

  const handleCheckboxClick = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  return (
    <article className="nav-header">
      {/* eslint-disable-next-line */}
      <label className="hamburger-menu">
        <input
          role="button"
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxClick}
        />
      </label>
      <aside className={`sidebar ${isChecked ? 'active' : ''}`}>
        <nav className="drop-menu">
          <ul className="menu">
            <li className="menu-list"><NavLink to="/" onClick={handleCheckboxClick}>Hostels</NavLink></li>
            {!user && (
              <>
                <li className="menu-list"><NavLink to="/login" onClick={handleCheckboxClick}>Login</NavLink></li>
                <li className="menu-list"><NavLink to="/signup" onClick={handleCheckboxClick}>Signup</NavLink></li>
              </>
            )}
            {user?.admin && <li className="menu-list"><NavLink to="/items/new" onClick={handleCheckboxClick}>Add New Car</NavLink></li>}
            {user && (
              <li className="menu-list">
                <NavLink to={`/${user?.username}/reservations`} onClick={handleCheckboxClick}>Reservations</NavLink>
              </li>
            )}
            {user?.admin && (
              <li className="menu-list">
                <NavLink to="/p/items/delete" onClick={handleCheckboxClick}>Delete Car</NavLink>
              </li>
            )}
            {user && (
              <li className="menu-list">
                <button type="button" onClick={handleLogout} className="log-out-btn">Logout</button>
              </li>
            )}
          </ul>
          <span className="campaign">
            <div>Explore</div>
          </span>
          <div className="app-social">
            <FaFacebook size={20} color="#3b5998" />
            <FaTwitter size={20} color="#1da1f2" />
            <FaLinkedin size={20} color="#0077b5" />
            <FaGithub size={20} color="#171515" />
          </div>
        </nav>
      </aside>
      {/* <NavLink to="#" className="logo logo-free logo-font">ERÉ</NavLink> */}
    </article>
  );
};

export default NavigationHeader;
