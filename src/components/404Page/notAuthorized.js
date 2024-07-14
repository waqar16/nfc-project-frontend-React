import React from 'react';

const NotAuthorizedPage = () => {
  return (
    <div style={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <h1>Not Authorized</h1>
      <p>You are not authorized.</p>
    </div>
  );
};

export default NotAuthorizedPage;
