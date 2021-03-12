/* eslint disable */
import '@babel/polyfill';
import { login, logOut } from './script';

const logOutBtn = document.querySelector('.logout');

const formData = document.querySelector('.form-group');

if (formData) {
  formData.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logOut);
}
