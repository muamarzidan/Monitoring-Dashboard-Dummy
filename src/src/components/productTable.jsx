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

    const checkCondition = (condition) => {
        if (condition === "Belum ada informasi") {
            return <span className="text-warning text-center fw-bold py-2 px-3 bg-warning rounded bg-opacity-10">Belum ada informasi</span>;
        } else if (condition === "Buruk") {
            return <span className="text-danger text-center fw-bold py-2 px-4 bg-danger rounded bg-opacity-10">Buruk</span>;
        } else if (condition === "Baik") {
            return <span className="text-success text-center fw-bold py-2 px-4 bg-success rounded bg-opacity-10">Baik</span>;
        } else {
            return <span className="text-success text-center fw-bold py-2 px-4 bg-success rounded bg-opacity-10">Sangat baik</span>;
        }
    };

    const InformationCondition = (condition) => {
        if (condition === "Belum ada informasi") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk belum siap dijual</span>;
        } else if (condition === "Buruk") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk tidak layak dijual</span>;
        } else if (condition === "Baik") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*2 produk tidak ada detail inforomasi</span>;
        } else {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk layak dijual</span>;
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

            <table className="table table-hover border">
                <thead className="thead-dark p-2">
                    <tr>
                        <th>Produk</th>
                        <th>Varian</th>
                        <th>Penjualan</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Kualitas Informasi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((entry) => (
                        <React.Fragment key={entry.id_product}>
                            {/* Row main products */}
                            <tr>
                                <td rowSpan={entry.product.variant.length + 1} className="products-main-link">
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
                                <td className="products-main-link"></td>
                                <td className="products-main-link">{entry.sells}</td>
                                <td className="products-main-link">{entry.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                <td className="products-main-link">{
                                    entry.new_stock === 0 ? (
                                        <span className="fw-bold text-danger">HABIS</span>
                                    ) : entry.new_stock
                                }</td>
                                <td className="products-main-link d-flex flex-column flex-start">
                                    {checkCondition(entry.condition)}
                                    {InformationCondition(entry.condition)}
                                </td>
                            </tr>
                            {/* Row variant products */}
                            {entry.product.variant.map((variant, index) => (
                                <tr key={`${entry.id_product}-variant-${index}`}>
                                    <td>{variant.name}</td>
                                    <td>{variant.sell}</td>
                                    <td>{variant.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                    <td>{
                                        variant.new_stock === 0 ? (
                                            <span className="text-danger">Habis</span>
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