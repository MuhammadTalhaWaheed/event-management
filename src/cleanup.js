import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKhryHK7SliSurFJN6AAAhQqcu39RRbG4",
  authDomain: "event-management-system-446fa.firebaseapp.com",
  projectId: "event-management-system-446fa",
  storageBucket: "event-management-system-446fa.firebasestorage.app",
  messagingSenderId: "944262160641",
  appId: "1:944262160641:web:7fe0c1f9a82675fc9d7b00",
  measurementId: "G-SS6CS2VMNC"
};

export const cleanupExpiredBookings = async () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const now = new Date();

    // Reference to the "bookings" collection in Firestore
    const bookingsCollection = collection(db, 'bookings');
    const bookingsQuery = query(bookingsCollection);

    // Get all bookings
    const snapshot = await getDocs(bookingsQuery);

    let deletedCount = 0;
    let skippedCount = 0;

    snapshot.forEach(async (doc) => {
      const booking = doc.data();
      const bookingEndTime = new Date(booking.date + "T" + booking.endTime);

      if (bookingEndTime <= now) {
        // Delete expired booking
        await deleteDoc(doc.ref);
        console.log("Deleted expired booking:", doc.id);
        deletedCount++;
      } else {
        console.log("Skipped booking (not expired):", doc.id);
        skippedCount++;
      }
    });

    if (deletedCount > 0) {
      console.log("Expired bookings cleaned up successfully.");
    } else if (skippedCount > 0) {
      console.log("No expired bookings found.");
    }
  } catch (error) {
    console.error("Error cleaning up expired bookings:", error);
  }
};

// Call the cleanup function
cleanupExpiredBookings();
