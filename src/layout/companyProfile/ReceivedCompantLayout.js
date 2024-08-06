import ReceivedCompany from '../../components/companyProfile/ReceivedCompany';
import React from 'react';

function ReceivedCompanyLayout() {
  React.useEffect(()=>{
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }   },[])
  return (
    <div>
        <ReceivedCompany />
    </div>
  );
}

export default ReceivedCompanyLayout;
