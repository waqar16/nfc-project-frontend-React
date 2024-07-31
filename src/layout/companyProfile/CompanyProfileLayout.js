import CompanyProfile from '../../components/companyProfile/CompanyProfile';
import React from 'react';

function CompanyProfileLayout() {
  React.useEffect(()=>{
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }   },[])
  return (
    <div>
        <CompanyProfile />
    </div>
  );
}

export default CompanyProfileLayout;
