import axios from 'axios';
import { showAlert } from './alert';

export const editTour = async (data, id) => {
  try {
    const url = `/api/v1/tours/${id}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Tour edited successfully!');
      // window.setTimeout(() => {
      //   location.assign('/add-tour');
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
};
