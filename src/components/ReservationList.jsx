import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchReservations } from '../redux/slices/reservationSlice';
import api from '../apiDomain.json';
import style from './ReservationList.module.css';

const ReservationsList = () => {
  const { reservations } = useSelector((state) => state.reservations);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${api.apiDomain}/api/v1/${user?.username}/reservations/${id}`, {
        headers: {
          Authorization: localStorage.getItem('authorization_token'),
        },
      });
      if (response.status === 200) {
        dispatch(fetchReservations({
          query: '', username: user?.username, perPage: 12, page: 1,
        }));
        navigate(`/${user.username}/reservations`);
      }
    } catch (error) {
      throw ('Error deleting reservation:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchReservations({
      query: '', username: user?.username, perPage: 12, page: 1,
    }));
  }, [dispatch, user?.username]);

  if (!user) {
    return <p>You must be logged in to view this page</p>;
  }

  return (
    <div className={style.reservations}>
      <div className={style['reservations-container']}>
        {reservations.map((reservation) => (
          <div key={reservation.id} className={style['reservations-content']}>
            <p>
              Reserved for use date:
              {' '}
              {reservation.reserve_for_use_date}
            </p>
            <ul>
              {reservation.item_list.map((item) => (
                <li key={item.id}>
                  <img
                    src={item.image_url ? `${api.apiDomain}/${item.image_url}` : ''}
                    alt={item.name}
                    style={{ width: '200px', height: '200px' }}
                  />
                  <p>
                    Name:
                    {' '}
                    {item.name}
                  </p>
                  <p>
                    Description:
                    {' '}
                    {item.description}
                  </p>
                  {item.show_reservation && (
                  <a href={item.show_reservation} style={{ color: 'black' }}>Show Reservation</a>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={[style['details-button'], style.button].join(' ')}
              type="button"
              onClick={() => navigate(`/${user.username}/reservations/${reservation.id}`)}
            >
              {' '}
              More Details
              {' '}
            </button>
            <button className={[style['delete-button'], style.button].join(' ')} type="button" onClick={() => handleDelete(reservation.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsList;
