import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Carousel from 'react-elastic-carousel';
import axios from 'axios';
import { deleteItemById, fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';

const Vehicles = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.profile);
  const [page] = useState(1);
  const perPage = 12;

  const location = useLocation();
  const navigate = useNavigate();

  const isDeleteRoute = location.pathname === '/p/items/delete';

  useEffect(() => {
    dispatch(fetchItems({ query: '', per_page: perPage, currentPage: page }));
  }, [dispatch, page, perPage]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${api.apiDomain}/api/v1/p/items/${id}`, {
        headers: {
          Authorization: localStorage.getItem('authorization_token'),
        },
      });

      if (response.status === 200) {
        dispatch(deleteItemById(id));
        navigate('/p/items/delete');
      }
    } catch (error) {
      throw ('Error deleting item:', error);
    }
  };

  const renderItems = () => items.map((n) => (
    <div className="card-item" key={n.id}>
      <img src={n.image_url ? `${api.apiDomain}/${n.image_url}` : car} alt={n.name} />
      <h3>{n.name}</h3>
      {!isDeleteRoute
      && (
      <>

        <div className="table-fee">
          <div>
            <span>Finance Fee:</span>
            <span>
              &#x20A6;
              {n.finance_fee}
            </span>
          </div>
          <div>
            <span>Option to Purchase Fee:</span>
            <span>
              &#x20A6;
              {n.option_to_purchase_fee}
            </span>
          </div>
          <div>
            <span>Total Amount Payable:</span>
            <span>
              &#x20A6;
              {n.total_amount_payable}
            </span>
          </div>
          <div>
            <span>Duration:</span>
            <span>{n.duration}</span>
          </div>
        </div>
        <div>
          <span>APR Representative:</span>
          <span>{n.apr_representative}</span>
        </div>
        {user && (
        <>
          <p>
            You Reserve:
            {n.you_reserve}
          </p>
          <Link to={`/item/${n.id}`}>MORE</Link>
        </>
        )}
      </>
      )}
      <hr />
      { isDeleteRoute && <button type="button" onClick={() => handleDelete(n.id)}>Delete</button>}
    </div>
  ));

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  const allItems = renderItems().length === 0 ? <p>No items found</p> : renderItems();

  return (
    <>
      <div className="p-title">
        <h2>Get an Hostel</h2>
        <h3>Please reserve your space</h3>
      </div>
      <Carousel breakPoints={breakPoints} focusOnSelect initialActiveIndex={1}>
        {allItems}
      </Carousel>
    </>
  );
};

export default Vehicles;
