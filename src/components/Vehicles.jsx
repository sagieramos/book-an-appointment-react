import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';
import style from './Vehicles.module.css';

const Vehicles = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.profile);
  const perPage = 120;

  useEffect(() => {
    dispatch(fetchItems({ query: '', per_page: perPage }));
  }, [dispatch, perPage]);

  const renderItems = () => items.map((n) => (
    <li key={n.id} className={style['vehicle-card']}>
      <div className={style.img}>
        <img
          src={n.image_url ? `${api.apiDomain}/${n.image_url}` : car}
          alt={n.name}
        />
      </div>
      <h3>{n.name}</h3>
      <p className={style.dummy}>
        aunthentic
      </p>
      <p>
        {' '}
        {n.description}
      </p>
      {user && (
      <p className={style['prev-reserve']}>
        You Reserve This Car
        {' '}
        <span>
          {n.you_reserve}
        </span>
        {' '}
        Time
      </p>
      )}
      <Link className={style['more-btn']} to={`/item/${n.id}`}>more Details</Link>
    </li>
  ));

  return (
    <div className={style['section-vehicles']}>
      <h2 className={style['vehicle-heading']}>Cars Models</h2>
      <ul className={style['vehicle-slider']}>{renderItems()}</ul>
    </div>
  );
};

export default Vehicles;
