import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../redux/slices/publicItemsSlices';
const Vehicles = () => {
  const dispatch = useDispatch();
  const { items, loading, error, totalPages, totalCount } = useSelector((state) => state.items);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  useEffect(() => {
    dispatch(fetchItems(`?page=${page}&per_page=${perPage}${search === '' ? '' : `&query=${search}`}`));
  }, [dispatch, search, page, perPage]);
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
        {items.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description} <span>{item.city}</span></p>
            <hr />
          </li>
        ))}
      </ul>
      <div>
        <button type="button" onClick={handlePreviousPage}>Previous Page</button>
        <button type="button" onClick={handleNextPage}>Next Page</button>
      </div>
      <div>
        <p>Total Count: {totalCount}</p>
        <p>Total Pages: {totalPages}</p>
      </div>
    </div>
  );
};
export default Vehicles; 