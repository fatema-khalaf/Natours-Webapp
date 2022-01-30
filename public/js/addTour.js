import axios from 'axios';
import { showAlert } from './alert';
export const addTour = async (data) => {
  try {
    const url = '/api/v1/tours';
    // 'http://127.0.0.1:3000/api/v1/tours';
    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    // IF logged in successfuly redirect to the main page after 1500 ms
    if (res.data.status === 'success') {
      showAlert('success', 'Tour added successfully!');
      window.setTimeout(() => {
        location.assign('/add-tour');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
};
