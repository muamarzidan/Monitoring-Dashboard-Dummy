import React, { useState, useEffect } from "react";

const salesData = [
  { id: 1, name: "Produk A", price: 100000, sold: 50 },
  { id: 2, name: "Produk B", price: 150000, sold: 30 },
  { id: 3, name: "Produk C", price: 200000, sold: 20 },
  { id: 4, name: "Produk D", price: 250000, sold: 10 },
  { id: 5, name: "Produk E", price: 300000, sold: 5 },
];

const classifyProducts = (data) => {
  // Hitung total pendapatan setiap produk
  const products = data.map((product) => ({
    ...product,
    revenue: product.price * product.sold,
  }));

  // Hitung total pendapatan semua produk
  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);

  // Urutkan produk berdasarkan pendapatan terbesar ke terkecil
  products.sort((a, b) => b.revenue - a.revenue);

  let accumulatedRevenue = 0;
  return products.map((product) => {
    accumulatedRevenue += product.revenue;
    const percentage = (accumulatedRevenue / totalRevenue) * 100;

    if (percentage <= 70) {
      return { ...product, category: "Best Seller" };
    } else if (percentage <= 90) {
      return { ...product, category: "Middle Moving" };
    } else {
      return { ...product, category: "Slow Moving" };
    }
  });
};

const ProductClassification = () => {
  const [classifiedProducts, setClassifiedProducts] = useState([]);

  useEffect(() => {
    const result = classifyProducts(salesData);
    setClassifiedProducts(result);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Klasifikasi Produk</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nama Produk</th>
            <th className="border px-4 py-2">Harga</th>
            <th className="border px-4 py-2">Terjual</th>
            <th className="border px-4 py-2">Pendapatan</th>
            <th className="border px-4 py-2">Kategori</th>
          </tr>
        </thead>
        <tbody>
          {classifiedProducts.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">Rp {product.price.toLocaleString()}</td>
              <td className="border px-4 py-2">{product.sold}</td>
              <td className="border px-4 py-2">Rp {product.revenue.toLocaleString()}</td>
              <td className="border px-4 py-2">{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductClassification;