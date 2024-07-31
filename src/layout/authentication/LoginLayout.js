import Login from '../../components/login/Login';
import React from 'react';
const loginLayout = () => {
    React.useEffect(()=>{
  
        const profile = document.getElementById('profile');
        if (profile) {
          profile.classList.remove('show-profile');
        }   },[])
    return (
        <div>
            <Login />
        </div>
    );
};

export default loginLayout;