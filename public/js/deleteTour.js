import axios from 'axios';
import { showAlert } from './alert';

export const deleteTour = async (id) => {
  try {
    const url = `/api/v1/tours/${id}`;
    console.log(url);
    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status === 204) {
      showAlert('success', 'Tour deleted successfully!');
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
