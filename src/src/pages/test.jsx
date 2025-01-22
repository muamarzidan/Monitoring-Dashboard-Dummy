import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import useDebounce from "../hooks/useDebounce";
import { Link } from "react-router-dom";

dayjs.extend(isBetween);
const AdsTable = ({ data }) => {
    const today = dayjs().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const convertEpochToDate = (epoch) => dayjs(epoch * 1000);

    const handleDateChange = (type, value) => {
        if (type === "start") {
            if (dayjs(value).isAfter(endDate)) {
                alert("Tanggal awal tidak boleh lebih dari tanggal akhir.");
                return;
            }
            setStartDate(value);
        } else {
            if (dayjs(value).isBefore(startDate)) {
                alert("Tanggal akhir tidak boleh kurang dari tanggal awal.");
                return;
            }
            setEndDate(value);
        }
    };

    const filteredByDate = useMemo(() => {
        return data.entry_list.filter((entry) => {
            const entryDate = convertEpochToDate(entry.campaign.start_time);
            return entryDate.isBetween(startDate, endDate, "day", "[]");
        });
    }, [startDate, endDate, data.entry_list]);

    useEffect(() => {
        let filtered = filteredByDate;
        if (debouncedSearchTerm !== "") {
            filtered = filtered.filter((entry) =>
                entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        if (activeFilter !== "all") {
            filtered = filtered.filter((entry) => entry.state === activeFilter);
        }

        if (selectedTypes.length > 0) {
            const selectedValues = selectedTypes.map((type) => type.value);
            filtered = filtered.filter((entry) => selectedValues.includes(entry.type));
        }

        setFilteredData(filtered);
    }, [debouncedSearchTerm, activeFilter, filteredByDate, selectedTypes]);

    const chartData = {
        labels: filteredByDate.map((entry) => entry.from),
        datasets: [
            {
                label: "Iklan Dilihat",
                data: filteredByDate.map((entry) => entry.report.impression),
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: "ROS",
                data: filteredByDate.map((entry) => entry.report.broad_roi),
                borderColor: "rgba(153, 102, 255, 1)",
                fill: false,
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };
    // inherit
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: true,
                },
            },
        },
    };

    const sumReportValue = (key) => {
        return filteredByDate.reduce((total, entry) => {
            return total + (entry?.report?.[key] || 0);
        }, 0);
    };

    const totalImpression = sumReportValue("impression"); // iklan dilihat
    const totalClick = sumReportValue("click"); // jumlah klik
    const totalCtr = sumReportValue("ctr"); // presentase klik

    return (
        <>
            {/* area satu */}
            <div className="d-flex flex-column gap-2 mb-5">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-1 fw-medium">Peforma Seluruh Iklan</h4>
                    <div className="d-flex gap-2">
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => handleDateChange("start", e.target.value)}
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => handleDateChange("end", e.target.value)}
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card border-light shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title">Iklan Dilihat</h6>
                                <p className="card-text fs-4 fw-bold">{totalImpression.toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card border-light shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title">Jumlah Klik</h6>
                                <p className="card-text fs-4 fw-bold">{totalClick.toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="card border-light shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title">Presentase Klik</h6>
                                <p className="card-text fs-4 fw-bold">{(totalCtr * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </>
    );
};