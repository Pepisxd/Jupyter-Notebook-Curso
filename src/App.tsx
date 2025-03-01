import "./App.css";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Content from "./components/content-usage";
import Characteristics from "./components/characteristics";
import Faq from "./components/faq";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Content />
      <Characteristics />
      <Faq />
      <Footer />
    </>
  );
}

export default App;
