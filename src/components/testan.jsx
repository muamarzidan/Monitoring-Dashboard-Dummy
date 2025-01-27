import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import jsonData from '../api/dummyAds.json';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function AdsDetail() {
    const { id } = useParams();
    const [adsProductDetail, setadsProductDetail] = useState(null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [chartData, setChartData] = useState([]);

    function potongAngka(angka) {
        const panjangAngka = String(angka).length;
        let indexPotong;
        if (panjangAngka === 11) {
            indexPotong = 8;
        } else if (panjangAngka === 12) {
            indexPotong = 9;
        } else if (panjangAngka === 10) {
            indexPotong = 7;
        }

        const angkaString = String(angka);
        const angkaPotong = angkaString.slice(0, indexPotong + 1);
        return parseInt(angkaPotong);
    }

    useEffect(() => {
        const fetchProductDetail = (id) => {
            return jsonData.data.data.entry_list.find(
                (product) => product.campaign.campaign_id === parseInt(id)
            );
        };
        const detail = fetchProductDetail(id);
        setadsProductDetail(detail);
    }, [id]);

    useEffect(() => {
        if (adsProductDetail) {
            const startTimestamp = new Date(startDate).getTime() / 1000;
            const endTimestamp = new Date(endDate).getTime() / 1000;

            const filteredData = [];
            for (let ts = startTimestamp; ts <= endTimestamp; ts += 86400) {
                const date = new Date(ts * 1000).toISOString().split('T')[0];
                const metrics = { date };

                if (selectedMetrics.includes('impression')) {
                    metrics.impression = parseFloat(adsProductDetail.report.impression).toFixed(2);
                }
                if (selectedMetrics.includes('click')) {
                    metrics.click = parseFloat(adsProductDetail.report.click).toFixed(2);
                }
                if (selectedMetrics.includes('ctr')) {
                    metrics.ctr = parseFloat(adsProductDetail.report.ctr * 100).toFixed(2);
                }

                filteredData.push(metrics);
            }
            setChartData(filteredData);
        }
    }, [adsProductDetail, startDate, endDate, selectedMetrics]);


    const handleMetricSelection = (metric) => {
        setSelectedMetrics((prevMetrics) => {
            if (prevMetrics.includes(metric)) {
                return prevMetrics.filter((m) => m !== metric);
            } else {
                return [...prevMetrics, metric];
            }
        });
    };

    if (!adsProductDetail) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <div className="container p-3 bg-white rounded gap-2 d-flex flex-column">
                <div className="d-flex align-items-center mb-3 gap-3">
                    <img src={"https://down-id.img.susercontent.com/file/" + adsProductDetail?.image} alt={adsProductDetail.title} className="rounded" style={{ width: "100px", height: "100px" }} />
                    <div>
                        <h5 className="mb-1">
                            {adsProductDetail?.title}
                        </h5>
                        <div>
                            <span className="text-secondary">Mode Bidding :</span> <span className="text-primary fw-bold bg-info-subtle px-2 py-1 rounded">{
                                adsProductDetail?.type == "product_manual" ? "Manual" : "Otomatis"
                            }</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ads Performance */}
            <div className="mt-5 d-flex flex-column gap-2">
                {/* Performance */}
                <h4 className="fw-bold">Peforma</h4>
                <div className="container d-flex gap-3 flex-column bg-white p-3 rounded">
                    <div className="d-flex justify-content-between">
                        <h6 className="fw-bold">Peforma Iklan</h6>
                        <div className="d-flex gap-3 mb-3">
                            <div>
                                <label htmlFor="start-date">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e, "start")}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange(e, "end")}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 justify-content-center border rounded pt-2 pb-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('impression') ? 'ads-detail-bg-button-filter-impression' : ''}`}
                                onClick={() => handleMetricSelection('impression')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Iklan Dilihat</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        {adsProductDetail.report.impression}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('click') ? 'ads-detail-bg-button-filter-click' : ''}`}
                                onClick={() => handleMetricSelection('click')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Jumlah Klik</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        {adsProductDetail.report.click}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('ctr') ? 'ads-detail-bg-button-filter-ctr' : ''}`}
                                onClick={() => handleMetricSelection('ctr')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Presentase Klik</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        {(adsProductDetail.report.ctr * 100).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ResponsiveContainer width="100%" height={400} className="mt-4">
                            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={true} />
                                <Tooltip />
                                <Legend />
                                {selectedMetrics.includes('impression') && (
                                    <Line type="monotone" dataKey="impression" stroke="#8884d8" strokeWidth={2} />
                                )}
                                {selectedMetrics.includes('click') && (
                                    <Line type="monotone" dataKey="click" stroke="#000000FF" strokeWidth={2} />
                                )}
                                {selectedMetrics.includes('ctr') && (
                                    <Line type="monotone" dataKey="ctr" stroke="#ffc658" strokeWidth={2} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Analysis */}
                <h4 className="fw-bold mt-4">Analisis</h4>
                {/* tabel data */}
                <div>
                    <div
                        className="table-wrapper ads-product-table"
                        style={{ overflowX: "auto" }}
                    >
                        <div
                            className="d-flex flex-column"
                            style={{ minWidth: "1400px", maxWidth: "none" }}
                        >
                            {/* head table */}
                            <div id="product-table-head" className="d-flex fw-medium">
                                <div
                                    className="d-flex justify-content-center align-items-center border border-info"
                                    style={{ width: "200px", minWidth: "200px" }}
                                >
                                    <span>Keyword</span>
                                </div>
                                <div
                                    className="d-flex justify-content-center align-items-center border border-info"
                                    style={{ width: "200px", minWidth: "200px" }}
                                >
                                    <span>Harga Bid</span>
                                </div>
                                <div
                                    className="d-flex justify-content-center align-items-center border border-info"
                                    style={{ width: "200px", minWidth: "200px" }}
                                >
                                    <span>Iklan Dilihat</span>
                                </div>
                                <div
                                    className="d-flex justify-content-center align-items-center border border-info"
                                    style={{ width: "200px", minWidth: "200px" }}
                                >
                                    <span>Jumlah Klik</span>
                                </div>
                            </div>
                            {/* body table */}
                            <div className="d-flex flex-column border">
                                <div
                                    id="product-table-body"
                                    className="d-flex border-bottom border-secondary-subtle"
                                    style={{
                                        border: "0px 0px 1px 0px",
                                        borderColor: "#e9ecef",
                                    }}
                                >
                                    {/* Keyword */}
                                    <div
                                        className="py-2 px-3"
                                        style={{ width: "200px", minWidth: "200px" }}
                                    >
                                        <div className="d-flex flex-column gap-2">
                                            {adsProductDetail.manual_product_ads.product_placement.map((product) => (
                                                <span className='py-1 px-2 bg-primary rounded text-white'>{
                                                    product == "targeting" ? "Rekomendasi" : "Pencarian"
                                                }</span>
                                            ))}
                                            {adsProductDetail.manual_product_ads.product_placement.length === 1 &&
                                                adsProductDetail.report.impression < adsProductDetail.manual_product_ads.bidding_price / 1000 ? (
                                                <span className="text-danger small mt-2">*mohon tambahkan kategori keyword</span>
                                            ) : adsProductDetail.manual_product_ads.product_placement.length === 1 &&
                                                adsProductDetail.report.impression > adsProductDetail.manual_product_ads.bidding_price / 1000 ? (
                                                <span className="text-success small mt-2">*tambahkan keyword lagi untuk meningkatkan iklan lebih ramai</span>
                                            ) : null}

                                        </div>
                                    </div>
                                    {/* Harga Bid */}
                                    <div
                                        className="py-2 ps-3"
                                        style={{ width: "200px", minWidth: "200px" }}
                                    >
                                        <div className="d-flex flex-column gap-2">
                                            <span>
                                                Rp.
                                                {adsProductDetail.manual_product_ads.bidding_price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </span>
                                            {(adsProductDetail.manual_product_ads.product_placement.length > 1 ||
                                                adsProductDetail.manual_product_ads.product_placement.length === 1) &&
                                                adsProductDetail.report.impression < adsProductDetail.manual_product_ads.bidding_price / 1000 ? (
                                                <span className="text-danger small mt-2">*mohon tambahkan harga bidding iklan</span>
                                            ) : adsProductDetail.manual_product_ads.product_placement.length > 1 &&
                                                adsProductDetail.report.impression > adsProductDetail.manual_product_ads.bidding_price / 1000 ? (
                                                <span className="text-success small mt-2">*tambahkan harga bidding lagi untuk meningkatkan iklan lebih ramai</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    {/* Iklan dilihat */}
                                    <div
                                        className="py-2 ps-3"
                                        style={{ width: "200px", minWidth: "200px" }}
                                    >
                                        <div className="d-flex flex-column">
                                            <span>
                                                {adsProductDetail.report.impression}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Jumlah Klik */}
                                    <div
                                        className="py-2 ps-3"
                                        style={{ width: "200px", minWidth: "200px" }}
                                    >
                                        <div className="d-flex flex-column">
                                            <span>
                                                {adsProductDetail.report.click}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};