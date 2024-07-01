import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLayout from './layout/home/HomeLayout'
import CompanySignupLayout from './layout/authentication/CompanySignupLayout'
import PersonalSignupLayout from './layout/authentication/PersonalSignupLayout'
import CompanyLoginLayout from './layout/authentication/CompanyLoginLayout'
import PersonalLoginLayout from './layout/authentication/PersonalLoginLayout'
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/company-signup" element={<CompanySignupLayout />} />
          <Route path="/personal-signup" element={<PersonalSignupLayout />} />
          <Route path="/company-login" element={<CompanyLoginLayout />} />
          <Route path="/personal-login" element={<PersonalLoginLayout />} />
          <Route path="/user-profile" element={<UserProfileLayout />} />
          <Route path="/FAQs" element={<FAQsLayout />} />
          <Route path="/about-us" element={<AboutUsLayout />} />
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/company-profile" element={<CompanyProfileLayout />} />
          <Route path="/reset-password" element={<ResetPasswordLayout />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ConfirmResetPasswordLayout />} />
          <Route path="/activate/:uid/:token" element={<Activation />} />
          <Route path="/activation-sent" element={<ActivationSentTemplate />} />
          <Route path="/digital-profile" element={<DigitalProfileLayout />} />



        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;