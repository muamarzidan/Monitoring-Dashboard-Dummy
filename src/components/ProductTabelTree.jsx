import React, { useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function ProductTable({ data }) {
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const products = data.products
    .map((product) => ({
      name: product.name,
      price: parseFloat(product.price_detail.selling_price_max),
      sold: product.statistics.sold_count,
      totalRevenue:
        parseFloat(product.price_detail.selling_price_max) *
        product.statistics.sold_count,
    }))
    .filter((product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

  const totalRevenueAllProducts = products.reduce(
    (sum, product) => sum + product.totalRevenue,
    0
  );

  const productsWithLabels = products.map((product) => {
    const contribution = (product.totalRevenue / totalRevenueAllProducts) * 100;
    let label = "";

    if (contribution > 70) {
        console.log(contribution);
      label = "Best Seller";
    } else if (contribution > 20 && contribution <= 70) {
        console.log(contribution);
      label = "Middle Moving";
    } else if (contribution > 10 && contribution <= 20) {
        console.log(contribution);
      label = "Slow Moving";
    }

    return {
      ...product,
      label,
    };
  });
  //inherit
  const getLabelStyle = (label) => {
    switch (label) {
      case "Best Seller":
        return { backgroundColor: "#00D355FF", color: "white", padding: "0.3rem 0.5rem", borderRadius: "0.25rem", width: "fit-content" };
      case "Middle Moving":
        return { backgroundColor: "blue", color: "white", padding: "0.3rem 0.5rem", borderRadius: "0.25rem", width: "fit-content" };
      case "Slow Moving":
        return { backgroundColor: "#E4BA00FF", color: "black", padding: "0.3rem 0.5rem", borderRadius: "0.25rem", width: "fit-content"};
      default:
        return {};
    }
  };

  const sortedProducts = [...productsWithLabels].sort((a, b) => {
    return sortOrder === "asc"
      ? a.totalRevenue - b.totalRevenue
      : b.totalRevenue - a.totalRevenue;
  });

  return (
    <div>
      {/* Input Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ padding: "0.7rem 1rem" }}
          placeholder="Cari produk berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Radio Button */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortOrder"
            id="sortDesc"
            value="desc"
            checked={sortOrder === "desc"}
            onChange={() => setSortOrder("desc")}
          />
          <label className="form-check-label" htmlFor="sortDesc">
            Tertinggi
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortOrder"
            id="sortAsc"
            value="asc"
            onChange={() => setSortOrder("asc")}
          />
          <label className="form-check-label" htmlFor="sortAsc">
            Terendah
          </label>
        </div>
      </div>

      {/* Tabel Products */}
      <div className="d-flex flex-column gap-2 border rounded">
        {/* Tabel header */}
        <div className="d-flex fw-bold border-bottom px-2 py-3 bg-info-subtle">
          <div style={{ flex: "0 0 750px", maxWidth: "750px" }}>Produk</div>
          <div style={{ flex: "0 0 150px", maxWidth: "150px" }}>Harga</div>
          <div style={{ flex: "0 0 100px", maxWidth: "100px" }}>Penjualan</div>
          <div style={{ flex: "0 0 200px", maxWidth: "200px" }}>
            Total Pendapatan
          </div>
        </div>

        {/* Tabel body */}
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product, index) => (
            <div
              key={index}
              className="d-flex align-items border-bottom px-2 pb-2 pt-2"
            >
              <div
                className="d-flex flex-column"
                style={{
                  flex: "0 0 750px",
                  maxWidth: "750px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {product.name}
                {product.label && (
                  <div className="text-white" style={getLabelStyle(product.label)}>
                    {product.label}
                  </div>
                )}
              </div>
              <div style={{ flex: "0 0 150px", maxWidth: "150px" }}>
                Rp {product.price.toLocaleString()}
              </div>
              <div style={{ flex: "0 0 100px", maxWidth: "100px" }}>
                {product.sold}
              </div>
              <div style={{ flex: "0 0 200px", maxWidth: "200px" }}>
                Rp {product.totalRevenue.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-muted">
            Tidak ada produk yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};