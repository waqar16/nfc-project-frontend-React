import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../../components/home/Home';
import OurApp from '../../components/OurApp/OurApp';
import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
import FeaturesSection from '../../components/featureSection/FeatureSection';
import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
import TestimonialsSection from '../../components/testimonialSection/TestimonialSection';
import Footer from '../../components/footer/Footer';


function HomeLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Check for auth token in localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // If token exists, fetch id, username, and profile_type from localStorage
      const id = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const profile_type = localStorage.getItem('profile_type');

      // Navigate based on profile_type
      if (profile_type && id && username) {
        if (profile_type === 'company') {
          navigate(`/company-profile/${id}/${username}`);
        } else if (profile_type === 'individual') {
          navigate(`/user-profile/${id}/${username}`);
        } else if (profile_type === 'employee') {
          navigate(`/employee-profile/${id}/${username}`);
        }
      } else {
        console.error("Missing required data in localStorage");
      }
    } else {
      // If token does not exist, render landing page and reset UI if necessary
      window.scrollTo(0, 0);
      const profile = document.getElementById('profile');
      if (profile) {
        profile.classList.remove('show-profile');
      }
    }

    // Set loading to false after processing
    setLoading(false);
  }, [navigate]);

  // Render only when the authentication check is complete
  if (loading) {
    return null; // Optionally, you can render a loading spinner here
  }

  return (
    <div>
      <Home />
      <FeaturesSection />
      <HowItWorksSection />
      <ScheduleMeetingSection />
      <OurApp />
      {/* <TestimonialsSection /> */}
      {/* <ContactSection /> */}
      {/* <FeedbackForm /> */}
      <Footer />
    </div>
  );
}

export default HomeLayout;
