import './assets/css/Global.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLayout from './layout/HomeLayout'
import CompanySignupLayout from './layout/CompanySignupLayout'
import PersonalSignupLayout from './layout/PersonalSignupLayout'
import CompanyLoginLayout from './layout/CompanyLoginLayout'
import PersonalLoginLayout from './layout/PersonalLoginLayout'
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;