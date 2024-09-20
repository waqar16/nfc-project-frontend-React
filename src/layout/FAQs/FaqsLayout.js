import FAQs from "../../components/FAQs/Faqs";
import Footer from "../../components/footer/Footer";

function FAQsLayout() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <FAQs />
      <Footer />
    </div>
  );
}

export default FAQsLayout;
