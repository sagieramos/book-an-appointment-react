import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../car.jpg';

const Vehicles = () => {
  const dispatch = useDispatch();
  const {
    items, loading, error, totalPages,
  } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.profile);
  const [page, setPage] = useState(1);
  const perPage = 12;
  useEffect(() => {
    dispatch(fetchItems({ query: '', per_page: perPage, currentPage: page }));
  }, [dispatch, page, perPage]);
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const renderItems = () => items.map(({
    id, name, description, city, financeFee, optionToPurchaseFee, totalAmountPayable,
    duration, aprRepresentative, createdAt, updatedAt, imageUrl, reservingIds,
    reservingUsernames, reservationCount, youReserve,
  }) => (
    <li key={id}>
      <img
        src={imageUrl && imageUrl ? `${api.apiDomain}/${imageUrl}` : car}
        alt={name}
        style={{ width: '50px', height: '50px' }}
      />
      <h3>{name}</h3>
      <p>
        Description:
        {description}
      </p>
      <p>
        City:
        {city}
      </p>
      <p>
        Finance Fee:
        {financeFee}
      </p>
      <p>
        Option to Purchase Fee:
        {optionToPurchaseFee}
      </p>
      <p>
        Total Amount Payable:
        {totalAmountPayable}
      </p>
      <p>
        Duration:
        {duration}
      </p>
      <p>
        APR Representative:
        {aprRepresentative}
      </p>
      <p>
        Created At:
        {createdAt}
      </p>
      <p>
        Updated At:
        {updatedAt}
      </p>
      <p>
        Reserving IDs:
        {reservingIds}
      </p>
      {user?.admin
      && (
      <>
        <p>
          Reservation Count:
          {reservationCount}
        </p>
        <p>
          Reserving Usernames:
          {reservingUsernames}
        </p>
      </>
      )}
      {user && (
      <p>
        You Reserve:
        {youReserve}
      </p>
      ) }
      <Link to={`/item/${id}`}>more</Link>
      <hr />
    </li>
  ));

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return (
      <p>
        Error:
        {error}
      </p>
    );
  }
  return (
    <div>
      <h2>Item List</h2>
      <ul>
        {renderItems()}
      </ul>
      <div>
        <p>
          {page}
          /
          {totalPages}
        </p>
        <button type="button" onClick={handlePreviousPage} disabled={page === 1}>Previous Page</button>
        <button type="button" onClick={handleNextPage} disabled={page === totalPages}>Next Page</button>
      </div>
    </div>
  );
};
export default Vehicles;
