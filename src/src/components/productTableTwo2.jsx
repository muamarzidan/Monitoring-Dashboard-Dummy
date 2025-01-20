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

    const checkIsRecommended = (variants, defaultStock) => {
        if (isRecommended(variants, defaultStock)) {
            return <span className="text-body" style={{fontSize: "12px"}}>*Informasi dan stok produk lebih dari minimal 75% dan layak di iklankan</span>;
        } else {
            return <span className="text-body" style={{fontSize: "12px"}}>*Informasi kurang karena stok produk kurang dari 75% dan tidak layak di iklankan</span>;
        }
    }

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

            <table className="table table-borderless border border-2">
                <thead className="thead-dark p-2">
                    <tr>
                        <th>Produk</th>
                        <th>Stok</th>
                        <th>Saran Iklan</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((entry) => (
                        <React.Fragment key={entry.id_product}>
                            {/* Row main products */}
                            <tr className="border border-2">
                                <td rowSpan={entry.product.variant.length + 1} className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    <Link to={`/product/detail/${entry.id_product}`} className="text-decoration-none text-black fw-medium d-flex flex-column">
                                        <img src="https://marketplace.canva.com/EAF5Wm8F050/1/0/1600w/canva-biru-modern-produk-skincare-kiriman-instagram-mPSe80ya_0A.jpg" alt={entry.product.name} className="rounded" style={{ width: "70px", height: "70px" }} />
                                        <div className="d-flex flex-column">
                                                <span>{entry.product.name}</span>
                                                <small className="text-body-secondary border-bottom border-2 pb-1">SKU: {entry.product.sku}</small>
                                                {entry.product.variant.map((variant, index) => (
                                                    <tr key={`${entry.id_product}-variant-${index}`}>
                                                        <td className="pb-3 pt-3">{variant.name}</td>
                                                    </tr>
                                                ))}
                                        </div>
                                    </Link>
                                </td>
                                <td className={`products-main-link ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    {entry.new_stock === 0 ? (
                                        <span className="fw-bold text-danger">HABIS</span>
                                    ) : entry.new_stock
                                }</td>
                                <td className={`products-main-link d-flex flex-column ${isRecommended(entry.product.variant, entry.default_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    {isRecommended(entry.product.variant, entry.default_stock) ? (
                                        <span className="fw-bold text-success">Disarankan</span>
                                    ) : (
                                        <span className="fw-bold text-danger">Tidak Disarankan</span>
                                    )}
                                    {checkIsRecommended(entry.product.variant, entry.default_stock)}
                                </td>
                            </tr>
                            {/* Row variant products */}
                            {entry.product.variant.map((variant, index) => (
                                <tr key={`${entry.id_product}-variant-${index}`} className="border border-0 border-white">
                                    <td>{variant.sell}</td>
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