import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51KJK1iFpuwy6X2nkjDRYT3G0ES6meYx0eCgRuE8vhW8P1o9hlbxihFzyD4BqBwfqd8azFCffFeeOgs1JMZNHRqDT00mz0cYPAr'
);
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    // const session = await axios(
    //   `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    // );
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
