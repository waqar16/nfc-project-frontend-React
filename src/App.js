import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useEffect,useState } from 'react';
import NotFoundPage from './components/404Page/404Page';
import NotAuthorizedPage from './components/404Page/notAuthorized';
import HomeLayout from './layout/home/HomeLayout'
import CompanySignupLayout from './layout/authentication/CompanySignupLayout'
import PersonalSignupLayout from './layout/authentication/PersonalSignupLayout'
import PersonalLoginLayout from './layout/authentication/PersonalLoginLayout'
import Navbar from './components/navbar/Navbar';
import UserProfileLayout from  './layout/userProfile/UserProfileLayout'
import CompanyProfileLayout from  './layout/companyProfile/CompanyProfileLayout'
import FAQsLayout from  './layout/FAQs/FaqsLayout'
import AboutUsLayout from  './layout/aboutus/AboutUsLayout'
import ScheduleMeeting from './components/scheduleMeetings/ScheduleMeetings'; 
import ResetPasswordLayout from './layout/authentication/ResetPasswordLayout';
import ConfirmResetPasswordLayout from './layout/authentication/ConfirmResetPasswordLayout';
import Activation from './components/accountActivate/activation';
import ActivationSentTemplate from './components/accountActivate/ActivationSentTemplate';
import DigitalProfileLayout from './layout/userProfile/DigitalProfileLayout';
import ReceivedProfileLayout from './layout/userProfile/ReceivedProfileLayout';
import AnalyticsLayout from './layout/analytics/AnalyticsLayout';
import EmployeeProfileLayout from './layout/emplyeeProfile/EmployeeProfileLayout';
import ProfileSummaryLayout from './layout/profileSummary/ProfileSummaryLayout';
import NfcCardLayout from './layout/nfcCard/NfcCardLayout';
import TeamManagementLayout from './layout/teamManagement/TeamManagementLayout';
import CompanyAnalyticsLayout from './layout/analytics/CompanyAnalyticsLayout';
import SignupForm from './components/signup/Signup';
import LoginLayout from './components/login/Login';
import AccountDeletion from './components/accountDeletion/AccountDeletion';
import EmployeeSignup from './components/employeeSignup/EmployeeSignup';
import CompanyCardLayout from './layout/companyProfile/CompanyCardLayout';
import ReceivedCompanyLayout from './layout/companyProfile/ReceivedCompantLayout';
import ManageAppointmentsLayout from './layout/scheduleMeetings/ManageAppointmentsLayout';
import ListReceivedCards from './layout/userProfile/ListReceivedCardsLayout';  
import ListCompanyProfile from './layout/companyProfile/ListCompanyCardLayout';

function App() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
  }, []);
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/complete-registration/:uid/:e_mail/:first_name/:last_name" element={<EmployeeSignup />} />
          <Route path="/account-deletion" element={<AccountDeletion />} />
          <Route path="/login" element={<LoginLayout />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          <Route path="/" element={<HomeLayout />} />
          <Route path="/company-signup" element={<CompanySignupLayout />} />
          <Route path="/personal-signup" element={<PersonalSignupLayout />} />
          <Route path="/personal-login" element={<PersonalLoginLayout />} />
          <Route path="/user-profile/:userId/:username" element={<UserProfileLayout />} />
          <Route path="/FAQs" element={<FAQsLayout />} />
          <Route path="/about-us" element={<AboutUsLayout />} />
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/company-profile/:userId/:username" element={<CompanyProfileLayout />} />
          <Route path="/reset-password" element={<ResetPasswordLayout />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ConfirmResetPasswordLayout />} />
          <Route path="/activate/:uid/:token" element={<Activation />} />
          <Route path="/activation-sent" element={<ActivationSentTemplate />} />
          <Route path="/digital-profile/:userId/:username" element={<DigitalProfileLayout />} />
          <Route path="/digital-profile/:userId/:username/received-cards" element={<ListReceivedCards />} />
          <Route path="/manage-appointments/:userId/:username" element={<ManageAppointmentsLayout />} />
          <Route path="/company-card/:userId/:username" element={<CompanyCardLayout />} />
          <Route path="/company-card/:userId/:username/received-cards" element={<ListCompanyProfile />} />
          <Route path="/profile/:identifier/" element={<ReceivedProfileLayout />} />
          <Route path="/company/:userId/" element={<ReceivedCompanyLayout />} />
          <Route path="/user-analytics/:userId/:username" element={<AnalyticsLayout/>}/>
          <Route path="/employee-profile/:userId/:username" element={<EmployeeProfileLayout/>}/>
          <Route path="/profile-summary/:userId/:username" element={<ProfileSummaryLayout/>}/>
          <Route path="/nfc-management/:userId/:username" element={<NfcCardLayout/>}/>
          <Route path="/team-management/:userId/:username" element={<TeamManagementLayout/>}/>
          <Route path="/company-analytics/:userId/:username" element={<CompanyAnalyticsLayout/>}/>

        </Routes>
      </div>
    </Router>
    </AuthProvider>

  );
}

export default App;