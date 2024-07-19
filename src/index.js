import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <GoogleOAuthProvider clientId="1036461909018-v32f9s35hefkbeq70gterh12sioug5a5.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
