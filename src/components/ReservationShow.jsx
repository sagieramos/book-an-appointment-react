import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../apiDomain.json';

const ReservationShow = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const authToken = localStorage.getItem('authorization_token');

        const response = await axios.get(
          `${api.apiDomain}/reservations/${reservationId}`,
          {
            headers: {
              Authorization: authToken,
              'Content-Type': 'application/json',
            },
          },
        );

        const { data } = response;

        const { reservation, items } = data.data;

        setReservation(reservation);
        setItems(items);
      } catch (error) {
        throw ('Error fetching reservation data:', error);
      }
    };

    fetchReservationData();
  }, [reservationId]);

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Reservation Details</h2>
      <p>
        Reservation ID:
        {reservation.id}
      </p>
      <p>
        Customer ID:
        {reservation.customer_id}
      </p>
      <p>
        Reserved for Use Date:
        {reservation.reserve_for_use_date}
      </p>
      <p>
        Created At:
        {reservation.created_at}
      </p>
      <p>
        Updated At:
        {reservation.updated_at}
      </p>

      <h3>Items</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>
              Name:
              {item.name}
            </p>
            <p>
              Description:
              {item.description}
            </p>
            <p>
              City:
              {item.city}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationShow;
