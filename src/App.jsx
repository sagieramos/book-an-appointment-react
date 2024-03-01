import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';

import {
  Routes, Route,
} from 'react-router-dom';
import ReservePage from './components/ReservePage';
import Login from './components/Login';
import { me } from './redux/slices/profileSlice';
import Registration from './components/Registration';
import Vehicles from './components/Vehicles';
import ItemForm from './components/ItemForm';
import ItemDetails from './components/ItemDetails';
import ReservationsList from './components/ReservationList';
import ReservationDetails from './components/ReservationDetails';
import NavigationHeader from './components/NavigationHeader';

const App = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state);
  const { user, error } = profile;

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

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
      {/*       {stillLoading
      && <div className="spinner"><RotateLoader color="#98bf11" /></div>} */}
      <header className="App-header">
        <div className="logo">
          {/* <img src={myLogo} alt="logo" /> */}
        </div>
        <NavigationHeader />
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
              <Route path="/p/items/delete" element={<Vehicles />} />
              <Route path="/:username/item/:id/reservation/new" element={<ReservePage />} />
            </>
          ) }
        </Routes>
      </main>
    </div>
  );
};

export default App;
