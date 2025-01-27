import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "../src/App.css";

import LoginPage from './pages/Auth/login';
import HomePage from './pages/Home';
import AdsPage from './pages/Ads/home';
import AdsDetailPage from './pages/Ads/ads-detail';
import ProductPage from './pages/Product/product';
import ProductRecomendationPage from './pages/Product/product-recomendation';
import ProductClasificationPage from './pages/Product/product-clasification';
import MerchantPage from './pages/Merchant';
import WilayahPage from './pages/Wilayah';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />+
        <Route path="/home" element={<HomePage />} />+
        <Route path="/product-ads-all" element={<AdsPage />} />
        <Route path="/product-ads-all/detail/:id" element={<AdsDetailPage />} />
        <Route path="/product-all" element={<ProductPage />} />
        <Route path="/product-recommendation" element={<ProductRecomendationPage />} />
        <Route path="/product-clasification" element={<ProductClasificationPage />} />
        <Route path="/merchant" element={<MerchantPage/>} />
        <Route path="/wilayah" element={<WilayahPage />} />
      </Routes>
    </Router>
  );
};

export default App;