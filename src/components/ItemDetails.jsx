import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BarLoader } from 'react-spinners';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';
import backbtn from '../assets/images/backbtn.svg';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [reserveDate, setReserveDate] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const dispatch = useDispatch();

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
        throw ('Error fetching item:', error);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${api.apiDomain}/api/v1/p/items/${id}`, {
        headers: {
          Authorization: localStorage.getItem('authorization_token'),
        },
      });
      if (response.status === 200) {
        dispatch(fetchItems());
        navigate('/');
      }
    } catch (error) {
      throw ('Error deleting item:', error);
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!reserveDate) {
      setValidationMessage('Please select a date');
      return;
    } if (new Date(reserveDate) < new Date()) {
      setValidationMessage('Please select a date in the future');
      return;
    }
    setValidationMessage('');
    const data = JSON.stringify({
      reservation: {
        reserve_for_use_date: reserveDate,
        reservation_items_attributes: [
          {
            item_id: id,
          },
        ],
      },
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${api.apiDomain}/api/v1/${user?.username}/reservations`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('authorization_token'),
      },
      data,
    };

    try {
      const response = await axios.request(config);
      if (response.status === 200) {
        navigate(`/${user.username}/reservations/${response.data.reservation.id}`);
      }
    } catch (error) {
      throw ('Error creating reservation:', error);
    }
  };

  const isMatchingUrl = () => new RegExp(`^/${user.username}/item/\\d+$`).test(location.pathname);
  const today = new Date().toISOString().split('T')[0];

  if (!item) {
    return <div className="bar-spinner"><BarLoader color="#98bf11" /></div>;
  }

  return (
    <div>
      <div>
        {!isMatchingUrl() && (
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backbtn} alt="back" />
          </button>
        )}
      </div>
      <h2>Item Details</h2>
      <img
        src={item.image_url ? `${api.apiDomain}/${item.image_url}` : car}
        alt={item.name}
      />
      <div className="table-fee">
        <div>
          <span>Name:</span>
          <span>{item.name}</span>
        </div>
        <div>
          <span>City:</span>
          <span>{item.city}</span>
        </div>
        <div>
          <span>Finance Fee:</span>
          <span>{item.finance_fee}</span>
        </div>
        <div>
          <span>Option to Purchase Fee:</span>
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
          <span>You Reserved: {item.you_reserve}</span>
        </div>
        {user?.admin && (
          <div>
            <span>Total Reservations: {item.reservation_count}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleReserve}>
        <input
          type="date"
          value={reserveDate}
          min={today}
          onChange={(e) => setReserveDate(e.target.value)}
        />
        {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
        <button type="submit">Reserve</button>
      </form>
      {user?.admin && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
      {isMatchingUrl() && user?.admin && (
      <button type="button" onClick={() => navigate(`/${user.username}/item/new`)}>
        Add new
      </button>
      )}
    </div>
  );
};

export default ItemDetails;
