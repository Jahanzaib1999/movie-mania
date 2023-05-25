import "./index.css";

//pages and components
import Navbar from "./components/Navbar";
import ContactPage from "./pages/contact/ContactPage";
import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/login/LoginPage";
import MoviesPage from "./pages/movies/MoviesPage";
import PricingPage from "./pages/pricing/PricingPage";
import TvSeriesPage from "./pages/tvseries/TvSeriesPage";

import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import DetailPage from "./pages/details/DetailPage";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import SearchPage from "./pages/search/SearchPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/movies" element={<MoviesPage />} />
          <Route exact path="/series" element={<TvSeriesPage />} />
          <Route exact path="/contact" element={<ContactPage />} />
          <Route exact path="/pricing" element={<PricingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/movie/:id" element={<DetailPage />} />
          <Route exact path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
