import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import "chart.js/auto";
import isBetween from "dayjs/plugin/isBetween";

import useDebounce from "../hooks/useDebounce";
import FilterCriteria from "./selectMultipleType";
import cutRoas from "../utils/cutRoas";
import convertPercentage from "../utils/convertPercentage";
import calculateClickConvertionPercentage from "../utils/calculateClickConvertPercentage";
import { DEFAULT_BIDDING } from "../constant/const";


dayjs.extend(isBetween);
const AdsTable = ({ data }) => {
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-09-30");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProductChart, setSearchProductChart] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 50);
  const debouncedSearchProductChart = useDebounce(searchProductChart, 50);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeMetrics, setActiveMetrics] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    biayaIklan: true,
    avgRank: true,
    penjualanDariIklan: true,
    roas: true,
    iklanDilihat: true,
    jumlahKlik: true,
    presentaseKlik: true,
    konversi: true,
    tingkatKonversi: true,
    produkTerjual: true,
    biayaPerKonversi: true,
    presentaseBiayaIklanAcos: true,
    konversiLangsung: true,
    produkTerjualLangsung: true,
    penjualanIklanLangsung: true,
    roasLangsung: true,
    acosLangsung: true,
    tingkatKonversiLangsung: true,
    biayaPerkonversiLangsung: true,
  });

  const filteredByDate = useMemo(() => {
    return data.entry_list.filter((entry) => {
      const entryDate = new Date(entry.campaign.start_time * 1000);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  }, [startDate, endDate, data.entry_list]);

  const handleOptionToggle = (option) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions((prev) =>
        prev.filter((opt) => opt.value !== option.value)
      );
    } else {
      setSelectedOptions((prev) => [...prev, option]);
    }
  };

  const options = useMemo(() => {
    return filteredByDate.map((entry, index) => ({
      value: index,
      label: entry.title,
    }));
  }, [filteredByDate]);

  useMemo(() => {
    setSelectedOptions(options.slice(0, 10));
  }, [options]);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchProductChart.toLowerCase())
    );
  }, [options, searchProductChart]);

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

  const chartData = useMemo(() => {
    const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  
    const metricColors = {
      impression: "#C61C1C", 
      click: "#EAE200",
      ctr: "#00C000",
      broad_order: "#368DFF",
      broad_order_amount: "#11008E",
      broad_gmv: "#BA01A1FF",
      cost: "#2D2D2D",
      broad_roi: "#DD9E00",
    };
  
    const datasets = [];
  
    activeMetrics.forEach((activeMetric) => {
      filteredByDate.forEach((entry, index) => {
        if (!selectedOptions.some((option) => option.value === index))
          return;
  
        let metric = null;
  
        switch (activeMetric) {
          case "impression":
            metric = entry.report.impression;
            break;
          case "click":
            metric = entry.report.click;
            break;
          case "ctr":
            metric = entry.report.ctr * 100;
            break;
          case "broad_order":
            metric = entry.report.broad_order;
            break;
          case "broad_order_amount":
            metric = entry.report.broad_order_amount;
            break;
          case "broad_gmv":
            metric = entry.report.broad_gmv;
            break;
          case "cost":
            metric = entry.report.cost;
            break;
          case "broad_roi":
            metric = entry.report.broad_roi;
            break;
          default:
            break;
        }
  
        const data = Array(30).fill(0);
        const startIndex =
          new Date(entry.campaign.start_time * 1000).getDate() - 1;
        data[startIndex] = metric;
  
        let customIndex = index + 1;
  
        datasets.push({
          label: `Produk ${customIndex}`,
          data,
          borderColor: metricColors[activeMetric] || "#000",
          fill: false,
          borderWidth: 2,
          tension: 0.4,
        });
      });
    });
  
    if (datasets.length === 0) {
      datasets.push({
        label: `Produk Default`,
        data: Array(30).fill(0),
        borderColor: "#000000",
        fill: false,
        borderWidth: 1,
        tension: 0.4,
      });
    }
  
    return { labels, datasets };
  }, [filteredByDate, selectedOptions, activeMetrics]);

  const toggleMetric = (metric) => {
    setActiveMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const typeOptions = [
    { label: "Iklan Manual", value: "product_manual" },
    { label: "Iklan Otomatis", value: "product_automate" },
    { label: "Max", value: "product_max" },
    { label: "Min", value: "product_min" },
  ];

  const handleTypeChange = (selected) => {
    setSelectedTypes(selected || []);
  };

  const sumReportValue = (key) => {
    return filteredByDate.reduce((total, entry) => {
      return total + (entry?.report?.[key] || 0);
    }, 0);
  };
  //inherit
  const totalImpression = sumReportValue("impression"); // iklan dilihat
  const totalClick = sumReportValue("click"); // jumlah klik
  const totalCtr = sumReportValue("ctr"); // presentase klik
  const totalOrder = sumReportValue("broad_order"); // pesanan
  const totalCheckout = sumReportValue("broad_order_amount"); // produk terjual
  const totalGmv = sumReportValue("broad_gmv"); // penjualan dari iklan
  const totalCost = sumReportValue("cost"); // biaya iklan
  const totalRoi = sumReportValue("broad_roi"); // ROAS
  //inherit
  const columnsConfig = {
    biayaIklan: {
      label: "Biaya Iklan",
      key: ["report.cost", "ratio.cost"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>Rp.{entry.report.cost.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.cost)}%
          </span>
        </div>
      ),
    },
    avgRank: {
      label: "Rata-rata Peringkat",
      key: ["report.avg_rank", "ratio.avg_rank"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.avg_rank}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>-</span>
        </div>
      ),
    },
    penjualanDariIklan: {
      label: "Penjualan dari Iklan",
      key: ["report.broad_gmv", "ratio.broad_gmv"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>Rp.{entry.report.broad_gmv.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.broad_gmv)}%
          </span>
        </div>
      ),
    },
    roas: {
      label: "ROAS",
      key: ["report.broad_roi", "ratio.broad_roi"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{cutRoas(entry.report.broad_roi)}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.broad_roi)}%
          </span>
        </div>
      ),
    },
    iklanDilihat: {
      label: "Iklan Dilihat",
      key: ["report.impression", "ratio.impression"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.impression.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.impression)}%
          </span>
        </div>
      ),
    },
    jumlahKlik: {
      label: "Jumlah Klik",
      key: ["report.click", "ratio.click"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.click.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.click)}%
          </span>
        </div>
      ),
    },
    presentaseKlik: {
      label: "Presentase Klik",
      key: ["report.ctr", "ratio.ctr"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{calculateClickConvertionPercentage(entry.ratio.ctr)}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.ctr)}%
          </span>
        </div>
      ),
    },
    konversi: {
      label: "Konversi",
      key: ["report.checkout", "ratio.checkout"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.checkout.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.checkout)}%
          </span>
        </div>
      ),
    },
    tingkatKonversi: {
      label: "Tingkat Konversi",
      key: ["report.cr", "ratio.cr"],
      width: 250,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{calculateClickConvertionPercentage(entry.report.cr)}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.cr)}%
          </span>
        </div>
      ),
    },
    produkTerjual: {
      label: "Produk Terjual",
      key: ["report.direct_order", "ratio.direct_order"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.direct_order.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_order)}%
          </span>
        </div>
      ),
    },
    biayaPerKonversi: {
      label: "Biaya per Konversi",
      key: ["report.cpc", "ratio.cpc"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>Rp.{entry.report.cpc.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.cpc)}%
          </span>
        </div>
      ),
    },
    presentaseBiayaIklanAcos: {
      label: "Presentase Biaya Iklan (ACOS)",
      key: ["report.broad_cir", "ratio.broad_cir"],
      width: 300,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>
            {calculateClickConvertionPercentage(entry.report.broad_cir)}
          </span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.broad_cir)}%
          </span>
          <span className="text-danger">
            {entry.report.broad_cir > DEFAULT_BIDDING
              ? "*Tambahkan bidding perklik"
              : ""}
          </span>
        </div>
      ),
    },
    konversiLangsung: {
      label: "Konversi Langsung",
      key: ["report.direct_cr", "ratio.direct_cr"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.direct_cr.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_cr)}%
          </span>
        </div>
      ),
    },
    produkTerjualLangsung: {
      label: "Produk Terjual Langsung",
      key: ["report.direct_order", "ratio.direct_order"],
      width: 300,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{entry.report.direct_order.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_order)}%
          </span>
        </div>
      ),
    },
    penjualanIklanLangsung: {
      label: "Penjualan dari Iklan Langsung",
      key: ["report.direct_gmv", "ratio.direct_gmv"],
      width: 300,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>Rp.{entry.report.direct_gmv.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_gmv)}%
          </span>
        </div>
      ),
    },
    // TEST
    roasLangsung: {
      label: "ROAS Langsung",
      key: ["report.direct_roi", "ratio.direct_roi"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>{cutRoas(entry.report.direct_roi)}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_roi)}%
          </span>
        </div>
      ),
    },
    // TEST
    acosLangsung: {
      label: "ACOS Langsung",
      key: ["report.direct_roi", "ratio.direct_roi"],
      width: 200,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>
            {calculateClickConvertionPercentage(entry.report.direct_roi)}
          </span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_roi)}%
          </span>
        </div>
      ),
    },
    tingkatKonversiLangsung: {
      label: "Tingkat Konversi Langsung",
      key: ["report.direct_cr", "ratio.direct_cr"],
      width: 300,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>
            {calculateClickConvertionPercentage(entry.ratio.direct_cr)}
          </span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_cr)}%
          </span>
        </div>
      ),
    },
    // TEST
    biayaPerkonversiLangsung: {
      label: "Biaya per Konversi Langsung",
      key: ["report.direct_roi", "ratio.direct_roi"],
      width: 300,
      isCustom: true,
      render: (entry) => (
        <div className="d-flex flex-column">
          <span>Rp.{entry.report.direct_roi.toLocaleString("id-ID")}</span>
          <span style={{ fontSize: "14px", color: "#0D26C6FF" }}>
            {convertPercentage(entry.ratio.direct_roi)}%
          </span>
        </div>
      ),
    },
  };
  //inherit
  const filteredColumns = Object.keys(selectedColumns).filter(
    (col) => selectedColumns[col]
  );
  //inherit
  const totalWidth = useMemo(() => {
    return Object.keys(selectedColumns)
      .filter((col) => selectedColumns[col])
      .reduce((acc, col) => acc + columnsConfig[col].width, 850);
  }, [selectedColumns, columnsConfig]);
  //inherit
  const getNestedProperty = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
      );
  };

  // all data filter
  useEffect(() => {
    let filtered = filteredByDate;
    let filteredProductChart = filteredByDate;
    if (debouncedSearchTerm !== "") {
      filtered = filtered.filter((entry) =>
        entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (debouncedSearchProductChart != "") {
      filteredProductChart = filteredProductChart.filter((entry) =>
        entry.title.toLowerCase().includes(debouncedSearchProductChart.toLowerCase())
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
  }, [debouncedSearchTerm, debouncedSearchProductChart, activeFilter, filteredByDate, selectedTypes]);

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
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("impression")
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
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("click")
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
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("ctr")
                  ? "ads-bg-button-filter-ctr text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("ctr")}
            >
              <div className="card-body">
                <h6 className="card-title">Presentase Klik</h6>
                <p className="card-text fs-4 fw-bold">
                  {(totalCtr * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("broad_order")
                  ? "ads-bg-button-filter-broad_order text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("broad_order")}
            >
              <div className="card-body">
                <h6 className="card-title">Pesanan</h6>
                <p className="card-text fs-4 fw-bold">
                  {totalOrder.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("broad_order_amount")
                  ? "ads-bg-button-filter-broad_order_amount text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("broad_order_amount")}
            >
              <div className="card-body">
                <h6 className="card-title">Produk Terjual</h6>
                <p className="card-text fs-4 fw-bold">
                  {totalCheckout.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("broad_gmv")
                  ? "ads-bg-button-filter-broad_gmv text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("broad_gmv")}
            >
              <div className="card-body">
                <h6 className="card-title">Penjualan dari Iklan</h6>
                <p className="card-text fs-4 fw-bold">
                  Rp.{totalGmv.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("cost")
                  ? "ads-bg-button-filter-cost text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("cost")}
            >
              <div className="card-body">
                <h6 className="card-title">Biaya Iklan</h6>
                <p className="card-text fs-4 fw-bold">
                  Rp.{totalCost.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div
              style={{ cursor: "pointer" }}
              className={`card border-light shadow-sm h-100 ${
                activeMetrics.includes("broad_roi")
                  ? "ads-bg-button-filter-broad_roi text-white"
                  : ""
              }`}
              onClick={() => toggleMetric("broad_roi")}
            >
              <div className="card-body">
                <h6 className="card-title">ROAS</h6>
                <p className="card-text fs-4 fw-bold">
                  {totalRoi.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-50 mt-4 filter-chart" style={{ width: "100%", maxWidth: "100%" }}>
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={searchProductChart}
            onChange={(e) => setSearchProductChart(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className="w-100 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {dropdownOpen && (
            <div
              className="mt-1 bg-white border rounded shadow-lg overflow-y-auto"
              style={{ position: "absolute"}}
            >
              <ul className="d-flex flex-column list-none p-0 m-0 gap-1" style={{ maxHeight: "200px" }}>
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className="d-flex align-items-center px-2 py-1 hover:bg-gray-200"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOptionToggle(option)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.some(
                        (selected) => selected.value === option.value
                      )}
                      onChange={() => handleOptionToggle(option)}
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-2">
          <Line data={chartData} options={options} />
        </div>
      </div>
      {/* area dua */}
      <div>
        <h4 className="mb-3 fw-medium">Semua Daftar Iklan</h4>
        {/* filter status iklan */}
        <div
          className="d-flex gap-3 justify-content-between align-items-center mb-3"
          style={{ width: "fit-content", listStyleType: "none" }}
        >
          <span>Status Iklan</span>
          {/* Filter buttons */}
          <div
            className={`ads-button-filter px-3 py-1 border border-info rounded-pill ${
              activeFilter === "all" ? "bg-info bg-opacity-25" : ""
            }`}
            onClick={() => setActiveFilter("all")}
            style={{ cursor: "pointer" }}
          >
            Semua
          </div>
          <div
            className={`ads-button-filter px-3 py-1 border border-info rounded-pill ${
              activeFilter === "ongoing" ? "bg-info bg-opacity-25" : ""
            }`}
            onClick={() => setActiveFilter("ongoing")}
            style={{ cursor: "pointer" }}
          >
            Berjalan
          </div>
          <div
            className={`ads-button-filter px-3 py-1 border border-info rounded-pill ${
              activeFilter === "off" ? "bg-info bg-opacity-25" : ""
            }`}
            onClick={() => setActiveFilter("off")}
            style={{ cursor: "pointer" }}
          >
            Nonaktif
          </div>
        </div>
        {/* search bar & select type*/}
        <div className="d-flex gap-3 w-full">
          <input
            type="text"
            className="form-control mb-1"
            style={{
              paddingTop: "10px",
              paddingBottom: "10px",
              maxWidth: "400px",
            }}
            placeholder="Cari berdasarkan nama"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ width: "300px" }}>
            <Select
              isMulti
              options={typeOptions}
              value={selectedTypes}
              onChange={handleTypeChange}
              placeholder="Tipe Iklan"
              className="mb-3"
            />
          </div>
        </div>
        <FilterCriteria
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          columnsConfig={columnsConfig}
        />
        {/* tabel data */}
        <div>
          <div
            className="table-wrapper ads-product-table"
            style={{ overflowX: "auto" }}
          >
            <div
              className="d-flex flex-column"
              style={{ minWidth: `${totalWidth}px`, maxWidth: "none" }}
            >
              {/* head table */}
              <div id="product-table-head" className="d-flex fw-medium">
                <div
                  className="d-flex justify-content-center align-items-center border border-info"
                  style={{ width: "50px", minWidth: "50px" }}
                >
                  <span></span>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center border border-info"
                  style={{ width: "600px", minWidth: "600px" }}
                >
                  <span>Nama Produk</span>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center border border-info"
                  style={{ width: "200px", minWidth: "200px" }}
                >
                  <span>Modal</span>
                </div>
                {filteredColumns.map((col) => (
                  <div
                    key={col}
                    className="d-flex justify-content-center align-items-center border border-info"
                    style={{
                      width: `${columnsConfig[col].width}px`,
                      minWidth: `${columnsConfig[col].width}px`,
                    }}
                  >
                    <span>{columnsConfig[col].label}</span>
                  </div>
                ))}
              </div>
              {/* body table */}
              <div className="d-flex flex-column border">
                {filteredData.map((entry, index) => (
                  <React.Fragment key={index}>
                    <div
                      id="product-table-body"
                      className="d-flex border-bottom border-secondary-subtle"
                      style={{
                        border: "0px 0px 1px 0px",
                        borderColor: "#e9ecef",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "50px", minWidth: "50px" }}
                      >
                        <input type="checkbox" />
                      </div>
                      {/* Nama Produk */}
                      <Link
                        to={`/product-ads-all/detail/${entry.campaign.campaign_id}`}
                        className="p-2 d-flex gap-2 text-decoration-none text-dark"
                        style={{ width: "600px", minWidth: "600px" }}
                      >
                        <img
                          src={
                            "https://down-id.img.susercontent.com/file/" +
                            entry.image
                          }
                          alt={entry.title}
                          className="rounded"
                          style={{ width: "70px", height: "70px" }}
                        />
                        <div className="d-flex flex-column justify-content-between">
                          <span
                            className="fw-medium"
                            style={{ fontSize: "18px" }}
                          >
                            {entry.title}
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            {entry.type == "product_manual"
                              ? "Iklan Manual"
                              : "Iklan Otomatis"}
                          </span>
                            <div className="w-full d-flex gap-1 align-items-center">
                              <div
                                className={`marker ${
                                  entry.state === "ongoing"
                                    ? "animated-circle"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor:
                                    entry.state === "ongoing" ? "#00EB3FFF" : "gray",
                                }}
                              ></div>
                              <span
                                className="fw-light"
                                style={{
                                  fontSize: "14px",
                                  color:
                                    entry.state === "ongoing"
                                      ? "inherit"
                                      : "gray",
                                }}
                              >
                                {entry.state === "ongoing"
                                  ? "Berjalan"
                                  : "Nonaktif"}
                              </span>
                            </div>
                        </div>
                      </Link>
                      {/* Modal */}
                      <div
                        className="py-2 ps-3"
                        style={{ width: "200px", minWidth: "200px" }}
                      >
                        <div className="d-flex flex-column">
                          <span>
                            <span>
                              Rp.
                              {entry.campaign.daily_budget.toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </span>
                          <span
                            style={{ fontSize: "14px", color: "#0D26C6FF" }}
                          >
                            per hari
                          </span>
                        </div>
                      </div>
                      {filteredColumns.map((col) => (
                        <div
                          key={col}
                          className="d-flex flex-column p-2 border"
                          style={{
                            width: `${columnsConfig[col].width}px`,
                            minWidth: `${columnsConfig[col].width}px`,
                          }}
                        >
                          {columnsConfig[col].isCustom ? (
                            columnsConfig[col].render(entry)
                          ) : (
                            <span>
                              {getNestedProperty(entry, columnsConfig[col].key)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdsTable;