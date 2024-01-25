import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchCars, addCar } from '../Redux/CarsSlice';
import AddCar from './AddCar';

const Vehicles = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.car);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);

  useEffect(() => {
    if (vehicles.length === 0) {
      dispatch(fetchCars());
    }
  }, [dispatch, vehicles.length]);

  const handleAddCar = (newCarData) => {
    dispatch(addCar(newCarData))
      .then(() => {
        setIsAddCarOpen(false);
        dispatch(fetchCars());
      })
      .catch((error) => {
        console.error('Error adding car:', error);
      });
  };

  return (
    <div className="main-page">
      <div className="vehiclesDiv">
        <h1>CARS ON SHOWROOM</h1>
        <h2>Please select a Car</h2>
        <Carousel interval={null} indicators={false}>
          {vehicles.map((veh) => (
            <Carousel.Item key={veh.id}>
              <Link className="details-link" to={`/details/${veh.id}`}>
                <div>
                  <img src={veh.img} className="vehicleImg" alt="" />
                  <h3>{veh.name}</h3>
                  <p>******************************</p>
                  <p>{veh.description}</p>
                </div>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <AddCar
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onAddCar={handleAddCar}
      />
    </div>
  );
};

export default Vehicles;