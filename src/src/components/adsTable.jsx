import React from "react";

const AdsTable = ({ data }) => {
    return (
        <div className="container mt-4">
            <h3 className="mb-3">Semua Daftar Iklan</h3>
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Nama Produk</th>
                        <th>Modal</th>
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
                        <th>Biaya per Konversi Langsung</th>
                    </tr>
                </thead>
                <tbody>
                    {data.entry_list.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.title}</td>
                            <td>{entry.campaign.daily_budget}</td>
                            <td>
                                {entry.editable_list.includes("status") ? "Editable" : "Not Editable"}
                            </td>
                            <td>{entry.ratio.cpc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdsTable;