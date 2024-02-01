import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';
import backbtn from '../assets/images/backbtn.svg';
import style from './Vehicles.module.css';

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
    return <p>Loading...</p>;
  }

  return (
    <div className={style['section-item-details']}>
      <div className={style['back-btn']}>
        {!isMatchingUrl() && (
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backbtn} alt="back" />
          </button>
        )}
      </div>
      <div className={style['details-img']}>
        <img
          src={item.image_url ? `${api.apiDomain}/${item.image_url}` : car}
          alt={item.name}
        />
      </div>
      <div className={style['details-des']}>
        <p className={style['details-name']}>
          {item.name}
        </p>
        <div className={style['details-info']}>
          <p className={style['dark-bg']}>
            <span>
              City:
            </span>
            <span>
              {item.city}
            </span>
          </p>
          <p>
            <span>
              Finance Fee:
            </span>
            <span>
              {item.finance_fee}
            </span>
          </p>
          <p className={style['dark-bg']}>
            <span>
              Purchase Fee:
            </span>
            <span>
              {item.option_to_purchase_fee}
            </span>
          </p>
          <p>
            <span>
              Total Payable:
            </span>
            <span>
              {item.total_amount_payable}
            </span>
          </p>
          <p className={style['dark-bg']}>
            <span>
              Duration:
            </span>
            <span>
              {item.duration}
            </span>
          </p>
          <p>
            <span>
              APR Representative:
            </span>
            <span>
              {item.apr_representative}
            </span>
          </p>
        </div>
        <p className={style['prev-reserve']}>
          You Reserve This Car
          {' '}
          <span>
            {item.you_reserve}
          </span>
          {' '}
          Time
        </p>
        {user?.admin && (
        <p>
          Your total reservation
          {' '}
            {item.reservation_count}
        </p>
        )}
        <form onSubmit={handleReserve} className={style['date-form']}>
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
          <button className={style['cancel-reservation']} type="button" onClick={handleDelete}>
            Cancel Reservation
          </button>
        )}
        {isMatchingUrl() && user?.admin && (
        <button className={style['add-new']} type="button" onClick={() => navigate(`/${user.username}/item/new`)}>
          Add new
        </button>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
