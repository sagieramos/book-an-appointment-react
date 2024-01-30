import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../car.jpg';

const Vehicles = () => {
  const dispatch = useDispatch();
  const { items, totalPages } = useSelector((state) => state.items);
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

  const renderItems = () => items.map((n) => (
    <li key={n.id}>
      <img
        src={n.image_url ? `${api.apiDomain}/${n.image_url}` : car}
        alt={n.name}
        style={{ width: '50px', height: '50px' }}
      />
      <h3>{n.name}</h3>
      <p>
        Finance Fee:
        {' '}
        {n.finance_fee}
      </p>
      <p>
        Option to Purchase Fee:
        {' '}
        {n.option_to_purchase_fee}
      </p>
      <p>
        Total Amount Payable:
        {' '}
        {n.total_amount_payable}
      </p>
      <p>
        Duration:
        {' '}
        {n.duration}
      </p>
      <p>
        APR Representative:
        {' '}
        {n.apr_representative}
      </p>
      {user && (
      <p>
        You Reserve:
        {' '}
        {n.you_reserve}
      </p>
      )}
      <Link to={`/item/${n.id}`}>more</Link>
      <hr />
    </li>
  ));

  return (
    <div>
      <h2>Items</h2>
      <ul>{renderItems()}</ul>
      <button type="button" disabled={page === 1} onClick={handlePreviousPage}>
        Previous Page
      </button>
      <button type="button" disabled={page === totalPages} onClick={handleNextPage}>
        Next Page
      </button>
    </div>
  );
};

export default Vehicles;
