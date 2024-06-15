import Home from '../../components/home/Home';
import OurApp from '../../components/OurApp/OurApp';
import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
import FeaturesSection from '../../components/featureSection/FeatureSection';
import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
import ContactSection from '../../components/contactSection/ContactSection';
import TestimonialsSection from '../../components/testimonialSection/TestimonialSection';

function HomeLayout() {
  return (
    <div>
      <Home/>
      <FeaturesSection/>
      <HowItWorksSection/>  
      <ScheduleMeetingSection/>
      <OurApp/>
      <TestimonialsSection/>
      <ContactSection/> 
      
    </div>
  );
}

export default HomeLayout;
