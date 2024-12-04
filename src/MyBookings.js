import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import jsPDF from 'jspdf';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByStartTime, setSortByStartTime] = useState(false);

  const username = Cookies.get('username');
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customDialogTitle, setCustomDialogTitle] = useState('');
  const [customDialogMessage, setCustomDialogMessage] = useState('');
  const [customDialogButtonName, setCustomDialogButtonName] = useState('');

  const pricingPerHour = 500; // Example pricing per hour

  // Custom Dialog Component
  const CustomDialog = ({ open, onClose, title, message, buttonName }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {buttonName}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Fetch bookings for the logged-in user
  useEffect(() => {
    if (username) {
      const fetchMyBookings = async () => {
        try {
          const bookingsCollectionRef = collection(db, 'bookings');
          const myBookingsQuery = query(bookingsCollectionRef, where('loggedin', '==', username));
          const querySnapshot = await getDocs(myBookingsQuery);

          const myBookings = [];
          querySnapshot.forEach((doc) => {
            myBookings.push({ id: doc.id, ...doc.data() });
          });

          setBookings(myBookings);
        } catch (error) {
          console.error('Error fetching user bookings:', error);
        }
      };

      fetchMyBookings();
    }
  }, [username]);

  // Calculate booking price
  const calculatePrice = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const duration = (end - start) / (1000 * 60 * 60); // Duration in hours
    return Math.max(duration, 0) * pricingPerHour;
  };

  // Generate and download invoice as PDF
  const generateInvoice = (booking) => {
    const { hallName, date, startTime, endTime } = booking;
    const price = calculatePrice(startTime, endTime);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 40);
    doc.text(`Hall: ${hallName}`, 20, 50);
    doc.text(`Start Time: ${startTime}`, 20, 60);
    doc.text(`End Time: ${endTime}`, 20, 70);
    doc.text(`Total Price: Rs. ${price}`, 20, 80);

    doc.save(`Invoice_${hallName}_${date}.pdf`);
  };

  return (
    <div>
      <CustomDialog
        open={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        title={customDialogTitle}
        message={customDialogMessage}
        buttonName={customDialogButtonName}
      />

      <h1>My Bookings for {username}</h1>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Price (Rs.)</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const price = calculatePrice(booking.startTime, booking.endTime);
            return (
              <tr key={booking.id}>
                <td>{booking.hallName}</td>
                <td>{booking.date}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endTime}</td>
                <td>{price}</td>
                <td>
                  <button onClick={() => generateInvoice(booking)}>Download</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/MainPage">
        <button className="button1">Back</button>
      </Link>
    </div>
  );
};

export default MyBookings;
