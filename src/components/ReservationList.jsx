import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchReservations } from '../Redux/slices/reservationSlice';
import api from '../apiDomain.json';
// import car from '../assets/car1.jpeg';
import style from './ReservationList.module.css';

const ReservationsList = () => {
  // Mock data for styling

  // const myReservations = [
  //   {
  //     customer_id: 1,
  //     reserve_for_use_date: '2021-09-01',
  //     item_list: [
  //       {
  //         id: 1,
  //         name: 'car',
  //         description: 'car',
  //         image_url: 'car',
  //         show_reservation: 'show_reservation',
  //       },
  //     ],
  //   },
  //   {
  //     customer_id: 1,
  //     reserve_for_use_date: '2021-09-01',
  //     item_list: [
  //       {
  //         id: 1,
  //         name: 'car',
  //         description: 'car',
  //         image_url: 'car.jpg',
  //         show_reservation: 'show_reservation',
  //       },
  //     ],
  //   },
  //   {
  //     customer_id: 1,
  //     reserve_for_use_date: '2021-09-01',
  //     item_list: [
  //       {
  //         id: 1,
  //         name: 'car',
  //         description: 'car',
  //         image_url: 'car.jpg',
  //         show_reservation: 'show_reservation',
  //       },
  //     ],
  //   },
  //   {
  //     customer_id: 1,
  //     reserve_for_use_date: '2021-09-01',
  //     item_list: [
  //       {
  //         id: 1,
  //         name: 'car',
  //         description: 'car',
  //         image_url: 'car.jpg',
  //         show_reservation: 'show_reservation',
  //       },
  //     ],
  //   },
  // ];

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
                    src={item.image_url ? `${api.apiDomain}/${item.image_url}` : car}
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

      <div className={style.pagination}>
        <p>
          {currentPage}
          /
          {totalPages}
        </p>
        <button type="button" onClick={handlePreviousPage}>Previous Page</button>
        <button type="button" onClick={handleNextPage}>Next Page</button>
      </div>
    </div>
  );
};

export default ReservationsList;
