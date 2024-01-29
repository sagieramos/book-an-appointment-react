import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservations } from '../redux/slices/reservationSlice';

const ReservationsList = () => {
  const { reservations } = useSelector((state) => state.reservations);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReservations({
      query: '', username: user?.username, per_page: 12, page: 1,
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
            Reservation ID:
            {' '}
            {reservation.id}
          </p>
          <p>
            Customer ID:
            {' '}
            {reservation.customer_id}
          </p>
          <p>
            Reserved for use date:
            {' '}
            {reservation.reserve_for_use_date}
          </p>
          <ul>
            {reservation.item_list.map((item) => (
              <li key={item.id}>
                <p>
                  Item ID:
                  {' '}
                  {item.id}
                </p>
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
                {/* Render other item details */}
                {item.show_reservation && (
                  <a href={item.show_reservation}>Show Reservation</a>
                )}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ReservationsList;
