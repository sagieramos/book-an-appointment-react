import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import nigeriaCities from '../nigeriaCities.json';
import api from '../apiDomain.json';

const ItemForm = () => {
  const { user } = useSelector((state) => state.profile);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [city, setCity] = useState('');
  const [financeFee, setFinanceFee] = useState('');
  const [optionToPurchaseFee, setOptionToPurchaseFee] = useState('');
  const [totalAmountPayable, setTotalAmountPayable] = useState('');
  const [duration, setDuration] = useState('');
  const [aprRepresentative, setAprRepresentative] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    const authToken = localStorage.getItem('authorization_token');

    const formData = new FormData();
    formData.append('item[name]', name);
    formData.append('item[description]', description);
    formData.append('item[image]', image);
    formData.append('item[city]', city);
    formData.append('item[finance_fee]', parseFloat(financeFee));
    formData.append('item[option_to_purchase_fee]', parseFloat(optionToPurchaseFee));
    formData.append('item[total_amount_payable]', parseFloat(totalAmountPayable));
    formData.append('item[duration]', parseInt(duration, 10));
    formData.append('item[apr_representative]', parseFloat(aprRepresentative));

    try {
      const response = await axios.post(`${api.apiDomain}/api/v1/${user?.username}/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authToken,
        },
      });

      if (response.status === 201) {
        navigate(`${user?.username}/item/${response.data.data.id}`);

        setName('');
        setDescription('');
        setImage(null);
        setCity('');
        setFinanceFee('');
        setOptionToPurchaseFee('');
        setTotalAmountPayable('');
        setDuration('');
        setAprRepresentative('');
        setError(null);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="item-name">
            Name:
            <input id="item-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-desc">
            Description:
            <input id="item-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-fee">
            Finance Fee ($):
            <input id="item-fee" type="number" value={financeFee} onChange={(e) => setFinanceFee(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-option-fee">
            Option to Purchase Fee ($):
            <input id="item-option-fee" type="number" value={optionToPurchaseFee} onChange={(e) => setOptionToPurchaseFee(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-total-amount">
            Total Amount Payable ($):
            <input id="item-total-amount" type="number" value={totalAmountPayable} onChange={(e) => setTotalAmountPayable(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-duration">
            Duration (months):
            <input id="item-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-apr">
            APR Representative (%):
            <input id="item-apr" type="number" value={aprRepresentative} onChange={(e) => setAprRepresentative(e.target.value)} />
          </label>
        </div>
        <div>
          <label htmlFor="item-city">
            City:
            <select id="item-city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select a city</option>
              {nigeriaCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="item-image">
            Image:
            <input id="item-image" type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ItemForm;