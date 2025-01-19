import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "../src/App.css";

import HomePage from './src/pages/Home';
import AdsPage from './src/pages/Ads';
import ProductPage from './src/pages/Product/product';
import ProductDetailPage from './src/pages/Product/product-detail';
import ProductRecomendationPage from './src/pages/Product/product-recomendation';
// import WilayahPage from './src/pages/Wilayah';
// <Route path="/wilayah" element={<WilayahPage />} />

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-ads-all" element={<AdsPage />} />
        <Route path="/product-all" element={<ProductPage />} />
        <Route path="/product/detail" element={<ProductDetailPage />} />
        <Route path="/product-recommendation" element={<ProductRecomendationPage />} />
      </Routes>
    </Router>
  );
};

export default App;