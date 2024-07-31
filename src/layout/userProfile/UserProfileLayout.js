import UserProfile from '../../components/userProfile/UserProfile';
import React from 'react';

function UserProfileLayout() {
  React.useEffect(()=>{
  
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }   },[])
  return (
    <div>
      <UserProfile/>
    </div>
  );
}

export default UserProfileLayout;
