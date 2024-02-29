import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { Spinner } from 'react-bootstrap';
import api from '../apiDomain.json';
import './ReservePage.css';

const ReservePage = () => {
  const [reserveDate, setReserveDate] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      try {
        console.log(`${api.apiDomain}/api/v1/p/items/${id}`);
        const response = await axios.get(`${api.apiDomain}/api/v1/p/items/${id}`, {
          headers: {
            Authorization: localStorage.getItem('authorization_token'),
          },
        });
        if (response.status === 200) {
          setItem(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        throw ('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  console.log(item);

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!reserveDate) {
      setValidationMessage('Please select a date');
      return;
    }
    if (new Date(reserveDate) < new Date()) {
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
        navigate(`/${user?.username}/reservations/${response.data.reservation.id}`);
      }
    } catch (error) {
      throw new Error('Error creating reservation:', error);
    }
  };

  if (!item) return <Spinner animation="border" variant="primary" />;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reserve-page" style={{ backgroundImage: `url(${api.apiDomain}${item.image_url})` }}>
      {loading && <BarLoader />}
      {item && (
        <>
          <div className="background-image" />
          <div className="content">
            <h2>{`Rent a ${item.name}`}</h2>
            <p>{item.description}</p>
            <form onSubmit={handleReserve}>
              <input
                type="date"
                value={reserveDate}
                min={today}
                onChange={(e) => setReserveDate(e.target.value)}
              />
              {validationMessage && <p className="error">{validationMessage}</p>}
              <button type="submit">Reserve now</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservePage;
