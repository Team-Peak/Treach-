/* eslint disable */
import '@babel/polyfill';


import {
  login,
  logOut,
  signUp,
  forgot,
  reset,
  updateSettings,
  createPost,
} from './script';

const logOutBtn = document.querySelector('.logout');
const SignUpData = document.querySelector('.sign-form');
const forgotData = document.querySelector('.forgot');
const loginData = document.querySelector('.login-data');
const resetData = document.querySelector('.reset-data');
const imgForm = document.getElementById('add-image');
const postForm = document.querySelector('#postForm');
const post = document.querySelector('#post');

//handles login
if (loginData) {
  loginData.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

//handles signUp
//handles login
if (SignUpData) {
  SignUpData.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    return signUp(fname, lname, email, password, passwordConfirm);
  });
}
//handles logging out
if (logOutBtn) {
  logOutBtn.addEventListener('click', logOut);
}

//handles sending reset token
if (forgotData) {
  forgotData.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    forgot(email);
  });
}

if (resetData) {
  resetData.addEventListener('submit', (e) => {
    e.preventDefault();
    const resetToken = document.querySelector('#token').value;

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(password, passwordConfirm, resetToken);

    reset(password, passwordConfirm, resetToken);
  });
}

if (imgForm)
  imgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('profile-img', document.getElementById('profile-img').files);

    updateSettings(form, 'data');
  });

if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    

    const form = new FormData();

    form.append('title', document.getElementById('title').value);
    form.append('tag', document.getElementById('tag').value);
    form.append('summary', document.getElementById('post').value);
    form.append('images', document.getElementById('images').files[0]);

    createPost(form);
  });
}
