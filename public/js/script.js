/* eslint disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged in successfully');
        location.assign('/');
      }, 1000);
    }

    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged out successfully');
        location.reload(true);
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const signUp = async (
  fname,
  lname,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        fname,
        lname,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Welcome to treach');
        location.assign('/');
      }, 200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const forgot = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Token sent to your email');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const reset = async (password, passwordConfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetpassword/${resetToken}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'password reset successfull');
        window.location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// type is either 'password' or 'data'
// type is either 'password' or 'data'
export const updateSettings = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/addphoto',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createPost = async (data) => {
  
  try {
    
    const res = await axios({
      method: 'POST',
      url: '/api/v1/posts',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Post created successfully');
      location.reload()
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const sendJobs = async(data)=>{
  try{
    const res = await axios({
      method:'GET',
      url:'/findjob',
      data
    })
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}
