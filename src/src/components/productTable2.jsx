import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce"; 

const ProductTable = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data.products);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm === "") { 
            setFilteredData(data.products);
        } else {
            const filtered = data.products.filter(
                (entry) =>
                    entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    entry.parent_sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [debouncedSearchTerm, data.products]);

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

    const informationCondition = (condition) => {
        if (condition === "Belum ada informasi") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk belum siap dijual</span>;
        } else if (condition === "Buruk") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk tidak layak dijual</span>;
        } else if (condition === "Baik") {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*2 produk tidak ada detail inforomasi</span>;
        } else {
            return <span className="text-body-tertiary fw-medium" style={{fontSize: "12px"}}>*produk layak dijual</span>;
        }
    };

    return (
        <div className="data-product-table">
            <h5 className="mb-3">{data.page_info.total} total produk</h5>
            <input
                type="text"
                className="form-control mb-3 py-3"
                placeholder="Cari berdasarkan nama, SKU"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="table border border-2 table-borderless">
                <thead className="thead-dark p-2">
                    <tr>
                        <th>Produk</th>
                        <th>Penjualan</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Kualitas Informasi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData?.map((entry) => (
                        <React.Fragment key={entry.id}>
                            {/* Row main products */}
                            <tr className="border border-2">
                                <td id="main-products" rowSpan={entry.model_list.length + 1} className="products-main-link">
                                    <div className="text-black fw-medium d-flex flex-column">
                                        <img src={`https://down-id.img.susercontent.com/file/` + entry.cover_image} alt={entry.name} className="rounded" style={{ width: "70px", height: "70px" }} />
                                        <div className="d-flex flex-column">
                                                <span>{entry.name}</span>
                                                <small className="text-body-secondary border-bottom border-2 pb-1">SKU: {entry.parent_sku}</small>
                                                {entry.model_list.map((model, index) => (
                                                    <tr key={`${entry.id}-model-${index}`}>
                                                        <td className="pb-3 pt-3">{model.name}</td>
                                                    </tr>
                                                ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="products-main-link">{entry.stock_detail.total_available_stock}</td>
                                <td className="products-main-link">{entry.price_detail.selling_price_min.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                <td className="products-main-link">{
                                    entry.stock_detail.total_available_stock === 0 ? (
                                        <span className="fw-bold text-danger">HABIS</span>
                                    ) : entry.new_stock
                                }</td>
                                <td className="products-main-link d-flex flex-column" style={{
                                    borderBottom: "0px",
                                    height: "86.5px",
                                }}>
                                    {checkCondition("Baik")}
                                    {informationCondition("Baik")}
                                </td>
                            </tr>
                            {/* Row model products */}
                            {entry.model_list.map((model, index) => (
                                <tr key={index} className="border border-0 border-white">
                                    <td>{model.statistics.sold_count}</td>
                                    <td>{model.price_detail.origin_price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                    <td>{
                                        model.stock_detail.total_available_stock === 0 ? (
                                            <span className="text-danger">Habis</span>
                                        ) : model.stock_detail.total_available_stock
                                    }</td>
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