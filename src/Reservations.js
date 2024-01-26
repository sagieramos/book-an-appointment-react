import React,{useState, useEffect} from 'react'
import './styles/Reservations.css'
import { MdNavigateNext } from 'react-icons/md';


function Reservations() {
    const reservations = [{name: 'Booking1', date: '12/29', city: 'Denver'},
    {name: 'Reservation2', date: '12/30', city: 'Denver'},
    {name: 'Reservation3', date: '12/31', city: 'Aspen'},
    {name: 'Reservation4', date: '12/29', city: 'Denver'},
    {name: 'Reservation5', date: '12/30', city: 'Denver'},]

    const [reservesPerPage, setReservesPerPage] = useState(calculateReservesPerPage());
    const [currentPage, setCurrentPage] = useState(0);

    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        const totalPages = Math.ceil(reservations.length / reservesPerPage);

        if (nextPage < totalPages) {
          setCurrentPage(nextPage);
        } else {
          setCurrentPage(0);
        }
    };

    useEffect(() => {
        function handleResize() {
          setReservesPerPage(calculateReservesPerPage());
        }

        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    function calculateReservesPerPage() {
        const windowWidth = window.innerWidth;
        if (windowWidth < 600) {
          return 1;
        } else if (windowWidth < 900) {
          return 2;
        } else {
          return 3;
        }
    }
  return (
    <div className='container'>
        <div className="nav">

        </div>
        <div className="reservations">
            <h1>Bookings</h1>
            <span className='color-gray'>Here are all the bookings you have made.</span>
            <div className='reservation-lists'>
                {reservations.slice(currentPage * reservesPerPage, (currentPage + 1) * reservesPerPage).map((reservation, index)=> (
                    <div className="cards" key={index}>
                        <p className='bg-gray'><span className="label">Name</span> <span className="value">{reservation.name}</span></p>
                        <p><span className="label">Date</span> <span className="value">{reservation.date}</span></p>
                        <p className='bg-gray'><span className="label">City</span> <span className="value">{reservation.city}</span></p>
                        <p><span className="label">Payment</span> <span className="value">$250.0</span></p>        
                        <button className='cancel-btn'>Cancel Booking</button>
                    </div>
                ))}
                <MdNavigateNext className="next-icon" onClick={handleNextClick} />
                
            </div>
        </div>
        
    </div>
  )
}

export default Reservations