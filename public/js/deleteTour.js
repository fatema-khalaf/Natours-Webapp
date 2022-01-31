import axios from 'axios';
import { showAlert } from './alert';

export const deleteTour = async (id) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/tours/${id}`;
    console.log(url);
    const res = await axios({
      method: 'DELETE',
      url,
    });
    console.log(res.status);
    console.log(res.data.status);

    // IF logged in successfuly redirect to the main page after 1500 ms
    if (res.status === 204) {
      showAlert('success', 'Tour deleted successfully!');
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
};
