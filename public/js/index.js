import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { showAlert } from './alert';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelectorAll('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const addDate = document.getElementById('addDate');
const startDates = document.getElementById('startDates');
//const back = document.getElementById('back');
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
    // let svg = document.createElement('svg');
    // svg.classList.add('menu-icon');
    // svg.innerHTML = '<use xlink:href="img/icons.svg#icon-star"/><use>';
    // userViewMenu.replaceChild(svg, userViewMenu.childNodes[0]);
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
