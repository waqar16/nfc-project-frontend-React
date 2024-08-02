import Home from '../../components/home/Home';
import OurApp from '../../components/OurApp/OurApp';
import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
import FeaturesSection from '../../components/featureSection/FeatureSection';
import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
import TestimonialsSection from '../../components/testimonialSection/TestimonialSection';
import { useEffect } from 'react';

function HomeLayout() {

  useEffect(() => {
    window.scrollTo(0, 0);
    
  }, []);

  return (
    <div>
      <Home/>
      <FeaturesSection/>
      <HowItWorksSection/>  
      <ScheduleMeetingSection/>
      <OurApp/>
      <TestimonialsSection/>
      {/* <ContactSection/>  */}
      {/* <FeedbackForm/> */}
      
      
    </div>
  );
}

export default HomeLayout;
