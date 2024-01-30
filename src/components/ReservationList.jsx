import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchReservations } from '../redux/slices/reservationSlice';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';

const ReservationsList = () => {
  const { reservations } = useSelector((state) => state.reservations);
  const { user } = useSelector((state) => state.profile);
  const { totalPages } = useSelector((state) => state.reservations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
    <div>
      {reservations.map((reservation) => (
        <div key={reservation.id}>
          <p>
            Reserved for use date:
            {' '}
            {reservation.reserve_for_use_date}
          </p>
          <ul>
            {reservation.item_list.map((item) => (
              <li key={item.id}>
                <img
                  src={item.image_url ? `${api.apiDomain}/${item.image_url}` : car}
                  alt={item.name}
                  style={{ width: '100px', height: '100px' }}
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
                  <a href={item.show_reservation}>Show Reservation</a>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate(`/${user.username}/reservations/${reservation.id}`)}
          >
            {' '}
            More Details
            {' '}
          </button>
          <hr />
          <button type="button" onClick={() => handleDelete(reservation.id)}>Delete</button>
        </div>
      ))}
      <p>
        {currentPage}
        /
        {totalPages}
      </p>
      <button type="button" onClick={handlePreviousPage}>Previous Page</button>
      <button type="button" onClick={handleNextPage}>Next Page</button>
    </div>
  );
};

export default ReservationsList;
