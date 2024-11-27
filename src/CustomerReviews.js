import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { getDatabase, ref, set, push, get } from 'firebase/database'; // Realtime Database code is still here for reference

const CustomerReviews = ({ venueId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reviews for the specific venue from Firestore
  useEffect(() => {
    const db = getFirestore();  // Firestore instance
    const reviewsRef = collection(db, 'reviews');  // Firestore collection reference
    const venueReviewsQuery = query(reviewsRef, orderBy('timestamp', 'desc'));  // Optional: order reviews by timestamp

    getDocs(venueReviewsQuery)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const fetchedReviews = snapshot.docs.map(doc => doc.data());
          setReviews(fetchedReviews);  // Set reviews to state
        }
        setIsLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching reviews: ', error);
        alert('There was an issue fetching reviews.');
      });
  }, [venueId]);

  const handleSubmit = async () => {
    // Ensure venueId is valid
   
  
    // Check if both rating and comment are provided
    if (!rating || !comment) {
      alert('Please provide both rating and comment.');
      return;
    }
  
    // Ensure rating is between 1 and 5
    if (parseInt(rating) < 1 || parseInt(rating) > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }
  
    const db = getFirestore();  // Firestore instance
    const reviewsRef = collection(db, 'reviews');  // Firestore collection reference
  
    try {
      // Add a new review document to Firestore
      await addDoc(reviewsRef, {
        rating: parseInt(rating),
        comment,
        timestamp: new Date(),  // Optionally add a timestamp field
      });
  
      // Clear form fields upon successful submission
      setRating('');
      setComment('');
      alert('Your review has been submitted.');
    } catch (error) {
      console.error('Error submitting review: ', error);
      alert('There was an issue submitting your review.');
    }
  };
  

  return (
    <div style={{ padding: '16px' }}>
      <h2>Rate the Venue</h2>

      <input
        type="number"
        placeholder="Rating (1 to 5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min="1"
        max="5"
        style={{ height: '40px', width: '100%', marginBottom: '12px', paddingLeft: '8px' }}
      />

      <textarea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: '100%', marginBottom: '12px', paddingLeft: '8px' }}
      />

      <button onClick={handleSubmit}>Submit Review</button>

      {isLoading ? (
        <p>Loading reviews...</p>
      ) : (
        <div>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((item, index) => (
                <li key={index}>
                  <strong>Rating:</strong> {item.rating}
                  <br />
                  <strong>Comment:</strong> {item.comment}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
