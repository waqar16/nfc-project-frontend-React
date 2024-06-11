import './assets/css/Global.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import OurApp from './components/OurApp/OurApp';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home/>
      <OurApp/>
      <Footer/>
    </div>
  );
}

export default App;
