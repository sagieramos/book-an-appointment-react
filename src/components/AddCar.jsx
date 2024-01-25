import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { addCar } from '../Redux/CarsSlice';

const AddCar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    const formattedData = {
      name: formData.name,
      description: formData.description,
      img: formData.image,
    
      user_id: 1,
    };
    
    try {
      dispatch(addCar(formattedData))
      .then(() =>{
      setFormData({
        name: '',
        description: '',
        image: '',
      });
      onClose();
  })
   .catch ((error) => {
    console.error('Error adding car:', error);
  });
} catch (error) {
  console.error('Error dispatching addCar:', error);
}
};

  
  
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    ariaHideApp={false}
    >
      <div className="form-container">
        <h2>Add New Car</h2>
        <form onSubmit={handleSubmit}>
          <div className='cont'>
          <div className="part">
            <input type="text" className="form-input" id="name" name="name" value={formData.name} onChange={handleChange} placeholder='Name' required />
            <input type="text" className="form-input" id="description" name="description" value={formData.description} onChange={handleChange} placeholder='Description' required />
            <input type="text" className="form-input" id="image" name="image" value={formData.image} onChange={handleChange} placeholder='Image' />
          </div>
    
          </div>
          <button type="submit" className="carBtn">Add Car</button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCar;