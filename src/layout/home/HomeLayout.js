// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Home from '../../components/home/Home';
// import OurApp from '../../components/OurApp/OurApp';
// import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
// import FeaturesSection from '../../components/featureSection/FeatureSection';
// import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
// import TestimonialsSection from '../../components/testimonialSection/TestimonialSection';
// import Footer from '../../components/footer/Footer';


// function HomeLayout() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//      if (isAuthenticated) {
//             const id = localStorage.getItem('userId');
//             const username = localStorage.getItem('username');
//             const profile_type = localStorage.getItem('profile_type');
      
//             // Navigate based on profile_type
//             if (profile_type && id && username) {
//               if (profile_type === 'company') {
//                 navigate(`/company-profile/${id}/${username}`);
//               } else if (profile_type === 'individual') {
//                 navigate(`/user-profile/${id}/${username}`);
//               } else if (profile_type === 'employee') {
//                 navigate(`/employee-profile/${id}/${username}`);
//               }
//             } 
          
//           }
//     setLoading(false);
//   }, []);

//   // Render only when the authentication check is complete
//   if (loading) {
//     return null; // Optionally, you can render a loading spinner here
//   }

//   return (
//     <div>
//       <Home />
//       <FeaturesSection />
//       <HowItWorksSection />
//       <ScheduleMeetingSection />
//       <OurApp />
//       {/* <TestimonialsSection /> */}
//       {/* <ContactSection /> */}
//       {/* <FeedbackForm /> */}
//       <Footer />
//     </div>
//   );
// }

// export default HomeLayout;





import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../../components/home/Home';
import OurApp from '../../components/OurApp/OurApp';
import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
import FeaturesSection from '../../components/featureSection/FeatureSection';
import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
// import TestimonialsSection from '../../components/testimonialSection/TestimonialSection';
import Footer from '../../components/footer/Footer';

  function HomeLayout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const id = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const profile_type = localStorage.getItem('profile_type');
        
        if (profile_type && id && username) {
          // Navigate based on profile_type
          if (profile_type === 'company') {
            navigate(`/company-profile/${id}/${username}`);
          } else if (profile_type === 'individual') {
            navigate(`/user-profile/${id}/${username}`);
          } else if (profile_type === 'employee') {
            navigate(`/employee-profile/${id}/${username}`);
          }
        }
      }

      setLoading(false);
    }, [navigate]);

    if (loading) {
      return null; // Optionally, render a loading spinner or placeholder here
    }

    return (
      <div>
        <Home />
        <FeaturesSection />
        <HowItWorksSection />
        <ScheduleMeetingSection />
        <OurApp />
        <Footer />
      </div>
    );
  }

  export default HomeLayout;





// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Home from '../../components/home/Home';
// import OurApp from '../../components/OurApp/OurApp';
// import ScheduleMeetingSection from '../../components/scheduleMeetings/ScheduleMeetingSection';
// import FeaturesSection from '../../components/featureSection/FeatureSection';
// import HowItWorksSection from '../../components/howItWorkSection/HowItWorkSection';
// import Footer from '../../components/footer/Footer';

// function HomeLayout() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     console.log('Token:', token); // Debugging

//     if (token) {
//       const id = localStorage.getItem('userId');
//       const username = localStorage.getItem('username');
//       const profile_type = localStorage.getItem('profile_type');

//       console.log('ID:', id); // Debugging
//       console.log('Username:', username); // Debugging
//       console.log('Profile Type:', profile_type); // Debugging

//       if (profile_type && id && username) {
//         // Force a slight delay to ensure the state updates correctly before navigation
//         setTimeout(() => {
//           if (profile_type === 'company') {
//             navigate(`/company-profile/${id}/${username}`);
//           } else if (profile_type === 'individual') {
//             navigate(`/user-profile/${id}/${username}`);
//           } else if (profile_type === 'employee') {
//             navigate(`/employee-profile/${id}/${username}`);
//           }
//         }, 100); // Delay by 100ms
//       }
//     }

//     setLoading(false);
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>; // Optionally, render a loading spinner or placeholder here
//   }

//   // If not authenticated, render the homepage content
//   return (
//     <div>
//       <Home />
//       <FeaturesSection />
//       <HowItWorksSection />
//       <ScheduleMeetingSection />
//       <OurApp />
//       <Footer />
//     </div>
//   );
// }

// export default HomeLayout;
