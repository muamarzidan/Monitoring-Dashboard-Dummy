import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import useDebounce from "../hooks/useDebounce";
import FilterCriteria from "./selectMultipleType";
import cutRoas from "../utils/cutRoas";
import convertPercentage from "../utils/convertPercentage";
import calculateClickConvertionPercentage from "../utils/calculateClickConvertPercentage";
import convertEpochToDate from "../utils/convertEpochDate";
import { DEFAULT_BIDDING } from "../constant/const";

dayjs.extend(isBetween);
const AdsTable = ({ data }) => {
    const [startDate, setStartDate] = useState("2024-09-01");
    const [endDate, setEndDate] = useState("2024-09-30");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [activeMetrics, setActiveMetrics] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const filteredByDate = useMemo(() => {
        return data.entry_list.filter((entry) => {
            const entryDate = new Date(entry.campaign.start_time * 1000);
            return (
                entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
            );
        });
    }, [startDate, endDate, data.entry_list]);

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

    const handleOptionToggle = (option) => {
        if (selectedOptions.some((selected) => selected.value === option.value)) {
            setSelectedOptions((prev) => prev.filter((opt) => opt.value !== option.value));
        } else {
            setSelectedOptions((prev) => [...prev, option]);
        }
    };

    // const handleOptionToggle = (option) => {
    //     setSelectedOptions((prev) =>
    //         prev.some((selected) => selected.value === option.value)
    //             ? prev.filter((selected) => selected.value !== option.value)
    //             : [...prev, option]
    //     );
    // };

    const chartData = useMemo(() => {
        const labels = Array.from({ length: 30 }, (_, i) => `2024-09-${i + 1}`);
        // Pemetaan warna berdasarkan metrik
        const metricColors = {
            impression: "#C61C1C", // Warna dari ads-bg-button-filter-impression
            click: "#EAE200", // Warna dari ads-bg-button-filter-click
            // Tambahkan warna lain untuk metrik tambahan
        };

        const datasets = filteredByDate.map((entry, index) => {
            if (!selectedOptions.some((option) => option.value === index)) return null;

            let metric = null;

            // Tentukan metrik berdasarkan tombol aktif
            const activeMetric = activeMetrics[0]; // Ambil metrik pertama yang aktif
            switch (activeMetric) {
                case "impression":
                    metric = entry.report.impression;
                    break;
                case "click":
                    metric = entry.report.click;
                    break;
                // dan data linnya
                default:
                    break;
            }

            const data = Array(30).fill(0);
            const startIndex = new Date(entry.campaign.start_time * 1000).getDate() - 1;
            data[startIndex] = metric;

            return {
                label: entry.title,
                data,
                borderColor: metricColors[activeMetric] || "#000000", // Gunakan warna dari pemetaan
                fill: false,
                borderWidth: 2,
                tension: 0.4,
            };
        });

        return { labels, datasets: datasets.filter(Boolean) };
    }, [filteredByDate, selectedOptions, activeMetrics]);
    // inherit
    const options = useMemo(() => {
        return filteredByDate.map((entry, index) => ({
            value: index,
            label: entry.title,
        }));
    }, [filteredByDate]);

    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);
    //inherit
    useMemo(() => {
        setSelectedOptions(options.slice(0, 10));
    }, [options]);

    const toggleMetric = (metric) => {
        setActiveMetrics((prev) =>
            prev.includes(metric)
                ? prev.filter((m) => m !== metric)
                : [...prev, metric]
        );
    };

    const sumReportValue = (key) => {
        return filteredByDate.reduce((total, entry) => {
            return total + (entry?.report?.[key] || 0);
        }, 0);
    };
    //inherit
    const totalImpression = sumReportValue("impression"); // iklan dilihat
    const totalClick = sumReportValue("click"); // jumlah klik

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
            filtered = filtered.filter((entry) =>
                selectedValues.includes(entry.type)
            );
        }

        setFilteredData(filtered);
    }, [debouncedSearchTerm, activeFilter, filteredByDate, selectedTypes]);

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
                        <div
                            style={{ cursor: "pointer" }}
                            className={`card border-light shadow-sm h-100 ${activeMetrics.includes("impression")
                                ? "ads-bg-button-filter-impression text-white"
                                : ""
                                }`}
                            onClick={() => toggleMetric("impression")}
                        >
                            <div className="card-body">
                                <h6 className="card-title">Iklan Dilihat</h6>
                                <p className="card-text fs-4 fw-bold">
                                    {totalImpression.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div
                            style={{ cursor: "pointer" }}
                            className={`card border-light shadow-sm h-100 ${activeMetrics.includes("click")
                                ? "ads-bg-button-filter-click text-dark"
                                : ""
                                }`}
                            onClick={() => toggleMetric("click")}
                        >
                            <div className="card-body">
                                <h6 className="card-title">Jumlah Klik</h6>
                                <p className="card-text fs-4 fw-bold">
                                    {totalClick.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* dan button lainnya */}
                </div>
                <div className="relative w-64" style={{ zIndex: 9999999 }}>
            {/* Input Search */}
            <input
                type="text"
                placeholder="Cari iklan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setDropdownOpen(true)} // Dropdown muncul saat input difokuskan
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Hilangkan dropdown saat blur
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Dropdown Options */}
            {dropdownOpen && (
                <div
                    className="mt-1 bg-white border rounded shadow-lg w-full overflow-y-auto" style={{zIndex: 9999999, position: "absolute"}}>
                    <ul className="list-none p-0 m-0 " style={{ maxHeight: "200px" }}>
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleOptionToggle(option)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.some(
                                        (selected) => selected.value === option.value
                                    )}
                                    onChange={() => handleOptionToggle(option)}
                                    className="mr-2"
                                />
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
                {/* <div className="relative mt-4">
                    <button
                        className="form-control text-left"
                        onClick={toggleDropdown}
                    >
                        {selectedOptions.length
                            ? selectedOptions.map((opt) => opt.label).join(", ")
                            : "Pilih iklan yang ditampilkan"}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
                            <input
                                type="text"
                                placeholder="Cari iklan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-2 py-1 border-b"
                            />
                            <ul className="list-none p-0 m-0">
                                {filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleOptionToggle(option)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.some(
                                                (selected) => selected.value === option.value
                                            )}
                                            onChange={() => handleOptionToggle(option)}
                                            className="mr-2"
                                        />
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </div> */}
                <div className="mt-4">
                    inforomasi
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </>
    );
};

export default AdsTable;