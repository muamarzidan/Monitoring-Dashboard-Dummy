import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "../src/App.css";

import HomePage from './src/pages/Home';
import AdsPage from './src/pages/Ads/home';
import AdsDetailPage from './src/pages/Ads/ads-detail';
import ProductPage from './src/pages/Product/product';
import ProductRecomendationPage from './src/pages/Product/product-recomendation';
import WilayahPage from './src/pages/Wilayah';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-ads-all" element={<AdsPage />} />
        <Route path="/product-ads-all/detail/:id" element={<AdsDetailPage />} />
        <Route path="/product-all" element={<ProductPage />} />
        <Route path="/product-recommendation" element={<ProductRecomendationPage />} />
        <Route path="/wilayah" element={<WilayahPage />} />
      </Routes>
    </Router>
  );
};

export default App;