import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { fetchItems } from '../redux/slices/publicItemsSlices';
import api from '../apiDomain.json';
import car from '../assets/images/car.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './Vehicles.module.css';

const Vehicles = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.profile);
  const perPage = 120;

  useEffect(() => {
    dispatch(fetchItems({ query: '', per_page: perPage }));
  }, [dispatch, perPage]);

  const sliderSettings = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  const renderItems = () => items.map((n) => (
    // <li key={n.id}>
    //   <img
    //     src={n.image_url ? `${api.apiDomain}/${n.image_url}` : car}
    //     alt={n.name}
    //     style={{ width: '50px', height: '50px' }}
    //   />
    //   <h3>{n.name}</h3>
    //   <p>
    //     Finance Fee:
    //     {' '}
    //     {n.finance_fee}
    //   </p>
    //   <p>
    //     Option to Purchase Fee:
    //     {' '}
    //     {n.option_to_purchase_fee}
    //   </p>
    //   <p>
    //     Total Amount Payable:
    //     {' '}
    //     {n.total_amount_payable}
    //   </p>
    //   <p>
    //     Duration:
    //     {' '}
    //     {n.duration}
    //   </p>
    //   <p>
    //     APR Representative:
    //     {' '}
    //     {n.apr_representative}
    //   </p>
    //   {user && (
    //   <p>
    //     You Reserve:
    //     {' '}
    //     {n.you_reserve}
    //   </p>
    //   )}
    //   <Link to={`/item/${n.id}`}>more</Link>
    //   <hr />
    // </li>
    <div key={n.id} className={style['vehicles-card']}>
      <img
        src={n.image_url ? `${api.apiDomain}/${n.image_url}` : car}
        alt={n.name}
        style={{ width: '50px', height: '50px' }}
      />
      <h3>{n.name}</h3>
      {user && (
        <p>
          You Reserve:
          {n.you_reserve}
        </p>
      )}
      <Link to={`/item/${n.id}`}>more</Link>
    </div>
  ));

  return (
    <div className={style['section-vehicle']}>
      <h2>Items</h2>
      <div className={style['vehicle-slider']}>
        <Slider
          infinite={sliderSettings.infinite}
          slidesToShow={sliderSettings.slidesToShow}
          slidesToScroll={sliderSettings.slidesToScroll}
          initialSlide={sliderSettings.initialSlide}
          beforeChange={sliderSettings.beforeChange}
        >
          {renderItems()}
        </Slider>
      </div>
    </div>
  );
};

export default Vehicles;
