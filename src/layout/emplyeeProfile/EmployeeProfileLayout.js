import EmployeeProfile from '../../components/employeeProfile/EmployeeProfile';
import React from 'react';

function EmployeeProfileLayout() {
  React.useEffect(()=>{
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }   },[])
  return (
    <div>
        <EmployeeProfile />
    </div>
  );
}

export default EmployeeProfileLayout;
