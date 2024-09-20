import AboutUs from "../../components/aboutus/AboutUs";
import Footer from "../../components/footer/Footer";

function AboutUsLayout() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <AboutUs />
      <Footer />
    </div>
  );
}

export default AboutUsLayout;
