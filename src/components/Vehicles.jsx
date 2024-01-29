import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json'
import car from '../car.jpg'
const Vehicles = () => {
  const dispatch = useDispatch();
  const { items, loading, error, totalPages } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.profile);
  const [page, setPage] = useState(1);
  const perPage = 12
  useEffect(() => {
    dispatch(fetchItems({ query: "", per_page: perPage, currentPage: page }));
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
  const renderItems = () => {
    return items.map(({ 
      id, image_url, name, total_amount_payable, duration, apr_representative,
      finance_fee, option_to_purchase_fee, you_reserve, reservation_count, reserving_usernames }) => (
      <li key={id}>
        <img
          src={image_url && image_url ? `${api.apiDomain}/${image_url}` : car}
          alt={name}
          style={{ width: '50px', height: '50px' }}
        />
        <h3>{name}</h3>
        <p>Total Amount Payable: {total_amount_payable}</p>
        <p>Duration: {duration}</p>
        <p>APR Representative: {apr_representative}</p>
        <p>Finance Fee: {finance_fee}</p>
        <p>Option to Purchase Fee: {option_to_purchase_fee}</p>
        {user && <p>You Reserve: {you_reserve}</p>}
        {user?.admin && <p>Reservation Count: {reservation_count}</p>}
        <Link to={`/item/${id}`}>more</Link>
        <hr />
      </li>
    ));
  };
  
  
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h2>Item List</h2>
      <ul>
        {renderItems()}
      </ul>
      <div>
        <p>{page}/{totalPages}</p>
        <button type="button" onClick={handlePreviousPage} disabled={page === 1}>Previous Page</button>
        <button type="button" onClick={handleNextPage} disabled={page === totalPages}>Next Page</button>
      </div>
    </div>
  );
};
export default Vehicles;