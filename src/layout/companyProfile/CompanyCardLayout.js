import CompanyCard from '../../components/companyProfile/CompanyCard';
import React from 'react';

function CompanyCardLayout() {
  React.useEffect(()=>{
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.remove('show-profile');
    }   },[])
  return (
    <div>
        <CompanyCard />
    </div>
  );
}

export default CompanyCardLayout;
