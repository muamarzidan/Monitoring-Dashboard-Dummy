import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import jsonData from '../../api/dummyAds.json';
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
                if (selectedMetrics.includes('broad_order_amount')) {
                    metrics.broad_order_amount = parseFloat(adsProductDetail.report.broad_order_amount);
                }
                if (selectedMetrics.includes('broad_gmv')) {
                    metrics.broad_gmv = parseFloat(potongAngka(adsProductDetail.report.broad_gmv));
                }
                if (selectedMetrics.includes('cost')) {
                    metrics.cost = parseFloat(adsProductDetail.report.cost).toFixed(2);
                }
                if (selectedMetrics.includes('broad_roi')) {
                    metrics.broad_roi = parseFloat(adsProductDetail.report.broad_roi).toFixed(2);
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
                {/* Details */}
                <div className="row bg-body-secondary py-3 rounded mx-1">
                    <div className="col-12 col-lg-4">
                        <div className="d-flex justify-content-between flex-column align-items-center">
                            <span>Modal</span>
                            <span className="fw-bold">
                                Rp.{adsProductDetail?.campaign.daily_budget.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="d-flex justify-content-between flex-column align-items-center">
                            <span>Periode Iklan</span>
                            <span className="fw-bold">
                                {adsProductDetail?.campaign.end_time == 0 ? "Tidak Terbatas" : new Date(adsProductDetail?.campaign.end_time * 1000).toISOString().split('T')[0]}
                            </span>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="d-flex justify-content-between flex-column align-items-center">
                            <span>Penempatan Iklan</span>
                            <span className="fw-bold">Semua</span>
                        </div>
                    </div>
                </div>
                {/* Analysis Section */}
                <div className="mt-2">
                    <h6 className="fw-bold">Analisis</h6>
                    <div className="row g-3">
                        <div className="col-6 col-lg-3">
                            <div className="p-3 border border-2 rounded text-center">
                                <p className="mb-1">Bidding</p>
                                <span className="text-success fw-bold">Baik</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="p-3 border border-2 rounded text-center">
                                <p className="mb-1">Modal</p>
                                <span className="text-success fw-bold">Baik</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="p-3 border border-2 rounded text-center">
                                <p className="mb-1">Saldo Iklan</p>
                                <span className="text-danger fw-bold">Perlu Ditingkatkan</span>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="p-3 border border-2 rounded text-center">
                                <p className="mb-1">Stabilitas Iklan</p>
                                <span className="text-muted fw-bold">Tidak Tersedia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ads Performance */}
            <div className="mt-5 d-flex flex-column gap-2">
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
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('broad_order_amount') ? 'ads-detail-bg-button-filter-broad_order_amount' : ''}`}
                                onClick={() => handleMetricSelection('broad_order_amount')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Produk Terjual</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        {adsProductDetail.report.broad_order_amount}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('broad_gmv') ? 'ads-detail-bg-button-filter-broad_gmv' : ''}`}
                                onClick={() => handleMetricSelection('broad_gmv')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Penjualan dari Iklan</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        Rp.{adsProductDetail.report.broad_gmv.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('cost') ? 'ads-detail-bg-button-filter-cost' : ''}`}
                                onClick={() => handleMetricSelection('cost')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">Biaya Iklan</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        Rp.{adsProductDetail.report.cost.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div
                                className={`card border-light shadow-sm h-100 ads-detail-button-filter ${selectedMetrics.includes('broad_roi') ? 'ads-detail-bg-button-filter-broad_roi' : ''}`}
                                onClick={() => handleMetricSelection('broad_roi')}
                            >
                                <div className="card-body">
                                    <h6 className="card-title">ROAS</h6>
                                    <p className="card-text fs-4 fw-bold">
                                        {adsProductDetail.report.broad_roi.toFixed(2)}
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
                                {selectedMetrics.includes('broad_order_amount') && (
                                    <Line type="monotone" dataKey="broad_order_amount" stroke="#ff0000" strokeWidth={2} />
                                )}
                                {selectedMetrics.includes('broad_gmv') && (
                                    <Line type="monotone" dataKey="broad_gmv" stroke="#00ff00" strokeWidth={2} />
                                )}
                                {selectedMetrics.includes('cost') && (
                                    <Line type="monotone" dataKey="cost" stroke="#0000ff" strokeWidth={2} />
                                )}
                                {selectedMetrics.includes('broad_roi') && (
                                    <Line type="monotone" dataKey="broad_roi" stroke="#ff00ff" strokeWidth={2} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};