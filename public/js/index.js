import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addTour } from './addTour';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { showAlert } from './alert';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');

const addTourForm = document.querySelector('.form-add-tour');

const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelectorAll('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const addDate = document.getElementById('addDate');
const menuIcon = document.querySelector('.menu-icon');
const adminNav = document.querySelector('.admin-nav');
const sideNav = document.querySelectorAll('.side-nav');
const userViewMenu = document.querySelector('.user-view__menu');
const userViewContent = document.querySelector('.user-view__content');

if (menuIcon) {
  menuIcon.addEventListener('click', (e) => {
    if (adminNav) adminNav.classList.toggle('display');
    sideNav.forEach((el) => el.classList.toggle('display'));
    userViewMenu.classList.toggle('flex-width');
  });
  userViewContent.addEventListener('click', () => {
    if (adminNav) adminNav.classList.remove('display');
    sideNav.forEach((el) => el.classList.remove('display'));
    userViewMenu.classList.remove('flex-width');
  });
}

if (addDate) {
  addDate.addEventListener('click', (e) => {
    const feild = `<input id="startDates" class ="form__input mb" type="date" placeholder="start dates" required name="startDates"/>`;
    e.preventDefault();
    console.log(e.target.parentElement);
    e.target.insertAdjacentHTML('afterbegin', feild);
  });
}

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(); // this form data to cary the file otherwise the file will not be sent
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (addTourForm) {
  addTourForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form2 = new FormData(); // this form data to cary the file otherwise the file will not be sent
    form2.append('name', document.getElementById('name').value);
    form2.append('duration', document.getElementById('duration').value);
    form2.append('difficulty', document.getElementById('difficulty').value);
    form2.append('maxGroupSize', document.getElementById('maxGroupSize').value);
    form2.append('price', document.getElementById('price').value);
    form2.append('summary', document.getElementById('summary').value);
    form2.append('description', document.getElementById('description').value);
    form2.append('startDates', document.getElementById('startDates').value);
    const satartLocation = {
      description: document.getElementById('startLocationDescription').value,
      coordinates: [
        document.getElementById('startLocationCoordinates').value.split(',')[0],
        document.getElementById('startLocationCoordinates').value.split(',')[0],
      ],
      address: document.getElementById('startLocationDescription').value,
    };
    // form2.append(
    //   'startLocationDescription',
    //   document.getElementById('startLocationDescription').value
    // );
    // form2.append(
    //   'startLocationCoordinates',
    //   document.getElementById('startLocationCoordinates').value
    // );
    // form2.append(
    //   'startLocationAddress',
    //   document.getElementById('startLocationAddress').value
    // );
    form2.append(
      'satartLocation',
      document.getElementById('startLocationDescription').value
    );
    form2.append(
      'satartLocation',
      document.getElementById('startLocationCoordinates').value.split(',')[0]
    );
    form2.append(
      'satartLocation',
      document.getElementById('startLocationCoordinates').value.split(',')[1]
    );
    form2.append(
      'satartLocation',
      document.getElementById('startLocationAddress').value
    );
    form2.append('guides', document.getElementById('guides').value);
    form2.append('imageCover', document.getElementById('imageCover').files[0]);
    form2.append('images', document.getElementById('image1').files[0]);
    form2.append('images', document.getElementById('image2').files[0]);
    console.log(document.getElementById('imageCover').files[0]);
    addTour(form2);

    const name = document.getElementById('name').value;
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save--password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save--password').textContent =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

console.log(logOutBtn);
if (logOutBtn) {
  logOutBtn.forEach((el) => el.addEventListener('click', logout));
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...'; // e.target => the cliked element (bookBtn)
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage);
