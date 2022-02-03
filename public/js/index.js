import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addTour } from './addTour';
import { editTour } from './updateTour';
import { deleteTour } from './deleteTour';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { showAlert } from './alert';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const addLocatios = document.getElementById('addLocatios');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const addTourForm = document.querySelector('.form-add-tour');
const dTour = document.querySelectorAll('.deleteTour');
const editTourForm = document.querySelector('.form-edit-tour');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelectorAll('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const addDate = document.getElementById('addDate');
const menuIcon = document.querySelector('.menu-icon');
const adminNav = document.querySelector('.admin-nav');
const sideNav = document.querySelectorAll('.side-nav');
const userViewMenu = document.querySelector('.user-view__menu');
const userViewContent = document.querySelector('.user-view__content');

if (addLocatios)
  addLocatios.addEventListener('click', (e) => {
    e.preventDefault();
    const locations = document.querySelector('.locations');
    const clone = locations.cloneNode(true);

    locations.before(clone);
  });

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
  let num = 0;
  const inputs = document.querySelectorAll('.hide');
  addDate.addEventListener('click', (e) => {
    e.preventDefault();
    inputs[num].style.display = 'unset';
    num++;
    if (num === 3) e.target.style.pointerEvents = 'none';
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

const formHolder = function (form, method, id) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const form2 = new FormData(); // this form data to cary the file otherwise the file will not be sent
    form2.append('name', document.getElementById('name').value);
    form2.append('duration', document.getElementById('duration').value);
    form2.append('difficulty', document.getElementById('difficulty').value);
    form2.append('maxGroupSize', document.getElementById('maxGroupSize').value);
    form2.append('price', document.getElementById('price').value);
    form2.append('summary', document.getElementById('summary').value);
    form2.append('description', document.getElementById('description').value);
    const dates = document.querySelectorAll('.startDate');
    dates.forEach((date) => {
      if (date.value) form2.append('startDates', date.value);
    });
    form2.append('startLocation[type]', 'Point');
    form2.append(
      'startLocation[description]',
      document.getElementById('startLocationDescription').value
    );
    form2.append(
      'startLocation[coordinates]',
      document
        .getElementById('startLocationCoordinates')
        .value.split(',')[0]
        .trim()
    );
    form2.append(
      'startLocation[coordinates]',
      parseInt(
        document
          .getElementById('startLocationCoordinates')
          .value.split(',')[1]
          .trim()
      )
    );
    form2.append(
      'startLocation[address]',
      document.getElementById('startLocationAddress').value
    );
    const guides = document.querySelectorAll('.guides');
    guides.forEach((guide) => {
      if (guide.checked === true) form2.append('guides', guide.value);
    });

    const locationsdescriptions = document.querySelectorAll(
      '.locationsdescription'
    );
    locationsdescriptions.forEach((el, i) => {
      console.log(el, i);
      form2.append(`locations[${i}][description]`, el.value);
    });

    const locationscoordinates = document.querySelectorAll(
      '.locationscoordinates'
    );
    locationscoordinates.forEach((el, i) => {
      console.log(el.value, i);
      console.log(el.value.split(',')[0].trim(), i);
      form2.append(
        `locations[${i}][coordinates]`,
        el.value.split(',')[0].trim()
      );
      form2.append(
        `locations[${i}][coordinates]`,
        el.value.split(',')[1].trim()
      );
    });

    const locationsdays = document.querySelectorAll('.locationsday');
    locationsdays.forEach((el, i) => {
      console.log(el, i);
      form2.append(`locations[${i}][day]`, el.value);
    });

    form2.append('imageCover', document.getElementById('imageCover').files[0]);
    const images = document.getElementById('image1').files;
    const indexes = [0, 1, 2];
    indexes.forEach((index) => {
      form2.append('images', images[index]);
    });
    method(form2, id);
    console.log(form2.entries());
  });
};
if (addTourForm) {
  formHolder(addTourForm, addTour);
}
if (editTourForm) {
  const id = document.getElementById('edit_id').value;
  formHolder(editTourForm, editTour, id);
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

if (dTour)
  dTour.forEach((el) => {
    el.addEventListener('click', (e) => {
      const tourId = el.dataset.tourId;
      e.target.style.pointerEvents = 'none';
      console.log(el);
      console.log(tourId);
      deleteTour(tourId);
    });
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage);
