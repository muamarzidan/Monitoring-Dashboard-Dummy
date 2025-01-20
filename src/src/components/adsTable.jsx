import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const AdsTable = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data.entry_list);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm === "") {
            setFilteredData(data.entry_list);
        } else {
            const filtered = data.entry_list.filter((entry) => entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
            setFilteredData(filtered);
        }
    }, [debouncedSearchTerm, data.entry_list]);

    return (
        <>
            <h3 className="mb-3 fw-semibold">Semua Daftar Iklan</h3>
            <div className="d-flex gap-3 justify-content-between align-items-center" style={{ width: "fit-content", listStyleType: "none" }}>
                <span>Status Iklan</span>
                <div className="ads-button-filter px-3 py-1 border border-info rounded-pill">Semua</div>
                <div className="ads-button-filter px-3 py-1 border border-info rounded-pill">Berjalan</div>
                <div className="ads-button-filter px-3 py-1 border border-info rounded-pill">Nonaktif</div>
            </div>
            <input
                type="text"
                className="form-control mb-3 py-3"
                placeholder="Cari berdasarkan nama"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Nama Produk</th>
                            {/* <th>Modal</th> */}
                            <th>Biaya Iklan</th>
                            <th>Penjualan dari iklan</th>
                            <th>Roas</th>
                            <th>Iklan Dilihat</th>
                            <th>Jumlah Klik</th>
                            <th>Presentase Klik</th>
                            <th>Konversi</th>
                            <th>Tingkat Konversi</th>
                            <th>Produk Terjual</th>
                            <th>Biaya Per Konversi</th>
                            <th>Presentase Biaya Iklan</th>
                            <th>Konversi Langsung</th>
                            <th>Produk Terjual Langsung</th>
                            <th>Penjualan dari iklan Langsung</th>
                            <th>ROAS</th>
                            <th>ACOS Langsung</th>
                            <th>Tingkat Konversi Langsung</th>
                            {/* <th>Biaya per Konversi Langsung</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((entry, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="fw-bold">{entry.title}</td>
                                    <td>{entry.title}</td>
                                    <td>{entry.ratio.cost}</td>
                                    <td>{entry.report.broad_gmv}</td>
                                    <td>{entry.report.broad_roi}</td>
                                    <td>{entry.report.impression}</td>
                                    <td>{entry.ratio.click}</td>
                                    <td>{entry.ratio.ctr}</td>
                                    <td>{entry.ratio.checkout}</td>
                                    <td>{entry.report.broad_order}</td>
                                    <td>{entry.report.cpc}</td>
                                    <td>{entry.ratio.broad_cir}</td>
                                    <td>{entry.ratio.direct_order}</td>
                                    <td>{entry.ratio.direct_order_amount}</td>
                                    <td>{entry.ratio.direct_gmv}</td>
                                    <td>{entry.ratio.direct_roi}</td>
                                    <td>{entry.report.direct_cir}</td>
                                    <td>{entry.report.direct_cr}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-wrapper ads-product-table" style={{ overflowX: "auto" }}>
                <div
                    className="d-flex flex-column gap-2"
                    style={{ minWidth: `${200 * 14 + 1600}px`, maxWidth: "none" }}
                >
                    <div id="product-table-head" className="d-flex border bg-body border-secondary-subtle">
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "500px", minWidth: "500px" }}
                        >
                            <span>Nama Produk</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Modal</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Biaya Iklan</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Penjualan dari iklan</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Roas</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Iklan Dilihat</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Jumlah Klik</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Presentase Klik</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Konversi</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Tingkat Konversi</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Produk Terjual</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Biaya per Konversi</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Presentase Biaya Iklan</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Konversi Langsung</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "300px", minWidth: "300px" }}
                        >
                            <span>Produk Terjual Langsung</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "300px", minWidth: "300px" }}
                        >
                            <span>Penjualan dari iklan Langsung</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>Roas</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "200px", minWidth: "200px" }}
                        >
                            <span>ACOS Langsung</span>
                        </div>
                        <div
                            className="d-flex justify-content-center align-items-center border"
                            style={{ width: "300px", minWidth: "300px" }}
                        >
                            <span>Tingkat Konversi Langsung</span>
                        </div>

                    </div>
                    <div className="d-flex border-bottom border-secondary-subtle">test</div>
                </div>
            </div>
        </>
    );
};

export default AdsTable;