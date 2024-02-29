import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchReservations } from '../redux/slices/reservationSlice';
import { AiOutlineDelete } from "react-icons/ai";
import api from '../apiDomain.json';
import './ReservationList.css';

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
    <div className="reservation-list">
      {reservations.map((reservation) => (
        <div key={reservation.id}>
          <p>
            Reserved for use date:
            {' '}
            {reservation.reserve_for_use_date}
          </p>

          {reservation.item_list.length > 0 && (
            <>
          <table className="item-table-reserved">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rent Fee</th>
              </tr>
            </thead>
            <tbody>
              {reservation.item_list.map((item) => (
                <tr key={item.id}>
                  <td>{item?.name}</td>
                  <td>{item?.finance_fee}</td>
                </tr>
              ))}
            </tbody>
            <div class="reservation-buttons">
          <button
            className="more-details"
            type="button"
            onClick={() => navigate(`/${user.username}/reservations/${reservation.id}`)}
          >
            {' '}
            More Details
            {' '}
          </button>
          <button className="delete-reservation" type="button" onClick={() => handleDelete(reservation.id)}><AiOutlineDelete /></button>
        </div>
            </table>
            </>)}
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
