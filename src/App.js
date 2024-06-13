import './assets/css/Global.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLayout from './layout/home/HomeLayout'
import CompanySignupLayout from './layout/authentication/CompanySignupLayout'
import PersonalSignupLayout from './layout/authentication/PersonalSignupLayout'
import CompanyLoginLayout from './layout/authentication/CompanyLoginLayout'
import PersonalLoginLayout from './layout/authentication/PersonalLoginLayout'
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import UserProfileLayout from  './layout/userProfile/UserProfileLayout'

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;