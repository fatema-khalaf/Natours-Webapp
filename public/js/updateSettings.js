import axios from 'axios';
import { showAlert } from './alert';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    console.log(data);
    const url =
      type === 'password'
        ? // ? '/api/v1/users/updateMyPassword'
          // : '/api/v1/users/updateMe';
          'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    // 'http://127.0.0.1:3000/api/v1/tours';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    // IF logged in successfuly redirect to the main page after 1500 ms
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updateed successfully!`);
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
