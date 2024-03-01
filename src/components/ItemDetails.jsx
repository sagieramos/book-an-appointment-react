import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SlArrowLeft } from 'react-icons/sl';
import axios from 'axios';
import { BarLoader } from 'react-spinners';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';

import './itemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${api.apiDomain}/api/v1/p/items/${id}`, {
          headers: {
            Authorization: localStorage.getItem('authorization_token'),
          },
        });
        if (response.status === 200) {
          setItem(response.data.data);
        }
      } catch (error) {
        throw new Error('Error fetching item:', error);
      }
    };
    fetchItem();
  }, [id]);

  const isMatchingUrl = () => new RegExp(`^/${user?.username}/item/\\d+$`).test(location.pathname); // Handling the case where user is null

  if (!item) {
    return <div className="bar-spinner"><BarLoader color="#98bf11" /></div>;
  }

  return (
    <div className="container">
      {!isMatchingUrl() && (
        // eslint-disable-next-line
        <button id="backButton" type="button" className="bk-btn" onClick={() => navigate(-1)}>
          <SlArrowLeft />
        </button>
      )}
      <img
        className="item-image"
        src={item.image_url ? `${api.apiDomain}/${item.image_url}` : car}
        alt={item.name}
      />
      <div className="table-fee">
        <div>
          <h3>{item.name}</h3>
          <span>
            You Reserved:
            {item.you_reserve}
          </span>
          {user?.admin && (
            <span>
              Total Reservations:
              {item.reservation_count}
            </span>
          )}
        </div>
        <div className="main-table">
          <div>
            <span>Rent Fee:</span>
            <span>{item.finance_fee}</span>
          </div>
          <div>
            <span>Agreement Fee:</span>
            <span>{item.option_to_purchase_fee}</span>
          </div>
          <div>
            <span>Total Amount Payable:</span>
            <span>{item.total_amount_payable}</span>
          </div>
          <div>
            <span>Duration:</span>
            <span>{item.duration}</span>
          </div>
          <div>
            <span>APR Representative:</span>
            <span>{item.apr_representative}</span>
          </div>
          <div>
            <span>
              You Reserved
              {item.you_reserve}
              {' '}
              Hostel
            </span>
          </div>
        </div>
      </div>

      {user && (
        <>
          <button id="reserveButton" className="reserve-btn" type="button" onClick={() => navigate(`/${user.username}/item/${item.id}/reservation/new`)}>
            Reserve
          </button>
        </>
      )}

    </div>
  );
};

export default ItemDetails;
