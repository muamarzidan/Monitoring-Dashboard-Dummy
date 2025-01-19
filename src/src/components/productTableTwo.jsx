import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

const ProductTable = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data.entry_list);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm === "") {
            setFilteredData(data.entry_list);
        } else {
            const filtered = data.entry_list.filter(
                (entry) =>
                    entry.product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    entry.product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [debouncedSearchTerm, data.entry_list]);

    const isRecommended = (variants, defaultStock) => {
        const totalNewStock = variants.reduce((acc, variant) => acc + variant.new_stock, 0);
        return totalNewStock >= 0.75 * defaultStock;
    };

    return (
        <div className="data-product-table">
            <h5 className="mb-3">{data.total} total produk</h5>
            {/* Input pencarian */}
            <input
                type="text"
                className="form-control mb-3 py-3"
                placeholder="Cari berdasarkan nama, SKU"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="table table-hover table-bordered">
                <thead className="thead-dark p-2">
                    <tr>
                        <th>Produk</th>
                        <th>Varian</th>
                        <th>Stok</th>
                        <th>Saran Iklan</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((entry) => (
                        <React.Fragment key={entry.id_product}>
                            {/* Row main products */}
                            <tr>
                                <td
                                    rowSpan={entry.product.variant.length + 1}
                                    className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                        ? "bg-success bg-opacity-10"
                                        : ""
                                        }`}
                                >
                                    <div className="d-flex">
                                        <img src="https://marketplace.canva.com/EAF5Wm8F050/1/0/1600w/canva-biru-modern-produk-skincare-kiriman-instagram-mPSe80ya_0A.jpg" alt={entry.product.name} className="rounded" style={{ width: "70px", height: "70px" }} />
                                    </div>
                                    <div className="d-flex flex-column">
                                        <Link to={`/product/detail/${entry.id_product}`} className="text-decoration-none text-black fw-semibold">
                                            {entry.product.name}
                                        </Link>
                                        <small className="text-body-secondary">SKU: {entry.product.sku}</small>
                                    </div>
                                </td>
                                <td className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`}></td>
                                <td className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`}>
                                    {entry.new_stock === 0 ? (
                                        <span className="badge text-danger">HABIS</span>
                                    ) : (
                                        entry.new_stock
                                    )}
                                </td>
                                <td className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`}>
                                    {isRecommended(entry.product.variant, entry.default_stock) ? (
                                        <span className="fw-bold text-success">Disarankan</span>
                                    ) : (
                                        <span className="fw-bold text-danger">Tidak Disarankan</span>
                                    )}
                                </td>
                            </tr>
                            {/* Row variant products */}
                            {entry.product.variant.map((variant, index) => (
                                <tr key={`${entry.id_product}-variant-${index}`}>
                                    <td>{variant.name}</td>
                                    <td>{
                                        variant.new_stock === 0 ? (
                                            <span className="badge text-danger">Habis</span>
                                        ) : variant.new_stock
                                    }</td>
                                    <td></td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;