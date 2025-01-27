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

    const isRecommended = (variants, defaultStock) => {
        const totalNewStock = variants.reduce((acc, variant) => acc + variant.stock_detail.total_available_stock, 0);
        return totalNewStock > 0.70 * defaultStock+1;
    };

    const checkIsRecommended = (variants, defaultStock) => {
        if (isRecommended(variants, defaultStock)) {
            return <span className="text-body" style={{fontSize: "12px"}}>*Informasi dan stok produk lebih dari minimal 70% dan layak di iklankan</span>;
        } else {
            return <span className="text-body" style={{fontSize: "12px"}}>*Informasi kurang karena stok produk kurang dari 70% dan tidak layak di iklankan</span>;
        }
    };

    return (
        <div className="data-product-table">
            <h5 className="mb-3">{data.page_info.total} total produk</h5>
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
                    {filteredData?.map((entry) => (
                        <React.Fragment key={entry.id}>
                            {/* Row main products */}
                            <tr className="border border-2">
                                <td rowSpan={entry.model_list.length + 1} className={`products-main-link ${isRecommended(entry.model_list, entry.stock_detail.total_available_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    <div className="text-decoration-none text-black fw-medium d-flex flex-column">
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
                                <td className={`products-main-link ${isRecommended(entry.model_list, entry.stock_detail.total_available_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    {entry.stock_detail.total_available_stock === 0 ? (
                                        <span className="fw-bold text-danger">HABIS</span>
                                    ) : entry.stock_detail.total_available_stock
                                }</td>
                                <td className={`products-main-link d-flex flex-column ${isRecommended(entry.model_list, entry.stock_detail.total_available_stock)
                                    ? "bg-success bg-opacity-10"
                                    : ""
                                    }`} style={{
                                        borderBottom: "0px",
                                        height: "129px",
                                    }}>
                                    {isRecommended(entry.model_list, entry.stock_detail.total_available_stock) ? (
                                        <span className="fw-bold text-success">Disarankan</span>
                                    ) : (
                                        <span className="fw-bold text-danger">Tidak Disarankan</span>
                                    )}
                                    {checkIsRecommended(entry.model_list, entry.stock_detail.total_available_stock)}
                                </td>
                            </tr>
                            {/* Row model products */}
                            {entry.model_list.map((model, index) => (
                                <tr key={`${entry.id}-model-${index}`} className="border border-0 border-white">
                                    <td>{model.stock_detail.total_available_stock}</td>
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