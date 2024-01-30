import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import api from '../apiDomain.json';

const ReservationDetails = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [items, setItems] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await axios.get(
          `${api.apiDomain}/api/v1/${user?.username}/reservations/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem('authorization_token'),
            },
          },
        );

        const { data } = response;

        const { reservation, items } = data.data;

        setReservation(reservation);
        setItems(items);
      } catch (error) {
        throw new Error('Error fetching reservation data:', error);
      }
    };

    fetchReservationData();
  }, [id, user]);

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
            <button type="button" onClick={() => navigate(`/item/${item.id}`)}>About Car</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ReservationDetails;
