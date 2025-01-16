import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "../src/App.css";

import HomePage from './src/pages/HomePage';
import WilayahPage from './src/pages/WilayahPage';
import ProdukPage from './src/pages/ProdukPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wilayah" element={<WilayahPage />} />
        <Route path="/produk" element={<ProdukPage />} />
      </Routes>
    </Router>
  );
};

export default App;