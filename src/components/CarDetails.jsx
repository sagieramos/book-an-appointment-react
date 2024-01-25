import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchCars } from '../Redux/CarsSlice';


const CarDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const intId = parseInt(id, 10);
  const carData = useSelector((state) => state.car.cars);
  const filteredData = carData.filter((item) => item.id === intId);
 
  useEffect(() => {
    if (carData.length === 0) {
      dispatch(fetchCars());
    }
  }, [dispatch]);
  return (
    <div>
      <div>
        {
        filteredData.map((item) => (
          <div className="car-detail-page" key={item.id}>
            <div className="img-container">
              <img src={item.img} alt="car-img" className="img" />
            </div>
            <div>
              <div>
                <p>{item.name}</p>
                
              </div>
              <button type="button" onClick={() => setShowReservationForm(true)}>
                <FontAwesomeIcon icon={faGear}  />
                Reserve
                <FontAwesomeIcon icon={faCircleChevronRight} />
              </button>
            </div>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default CarDetails;