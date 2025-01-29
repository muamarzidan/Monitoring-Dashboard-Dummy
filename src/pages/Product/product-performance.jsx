import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import DashboardLayout from "../../components/DashboardLayout";
import { ButtonFilterChart } from "../../components/buttonFilterChart";
import { formatDate } from "../../utils/formatDate";
import { generateDateRange } from "../../utils/generateDateRange";
import dataProduct from "../../api/dummyAds.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function ProductPerformancePage() {
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-09-30");
  const [filteredData, setFilteredData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [activeFilter, setActiveFilter] = useState("daily");
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const labels = generateDateRange(startDate, endDate);
    setXLabels(labels);
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    const data = dataProduct;
    const entries = data.data.data.entry_list;
  
    const filteredEntries = entries.filter((item) => {
      const entryDate = formatDate(item.campaign.start_time);
      return entryDate >= startDate && entryDate <= endDate;
    });
  
    setFilteredData(filteredEntries);
  
    const initialXLabels = generateDateRange(startDate, endDate);
    const initialGroupedData = groupDataByFilter(filteredEntries, initialXLabels, "daily");
    
    setXLabels(initialXLabels);
    setGroupedData(initialGroupedData);
    setActiveFilter("daily");
  };
  

  // const fetchData = async () => {
  //   const data = dataProduct;
  //   const entries = data.data.data.entry_list;
  //   setFilteredData(entries);

  //   const initialXLabels = generateDateRange(startDate, endDate);
  //   const initialGroupedData = groupDataByFilter(entries, initialXLabels, "daily");
    
  //   setXLabels(initialXLabels);
  //   setGroupedData(initialGroupedData);
  //   setActiveFilter("daily");
  // };
  
  // const fetchData = async () => {
  //   const data = dataProduct;
  //   setFilteredData(data.data.data.entry_list);
  // };

  const keyColors = {
    // cost: "hsl(120, 70%, 50%)",
    impression: "hsl(0, 70%, 50%)",
    click: "hsl(240, 70%, 50%)",
  };  

  const groupDataByFilter = (data, labels, filter) => {
    const groupedData = {};
    
    labels.forEach((label) => {
      groupedData[label] = [];
    });

    data.forEach((item) => {
      const entryDate = formatDate(item.campaign.start_time);
  
      let targetLabel;
      if (filter === "weekly") {
        targetLabel = labels.find((label) => new Date(entryDate) <= new Date(label)) || labels[labels.length - 1];
      } else if (filter === "monthly") {
        targetLabel = labels.find((label) => entryDate.startsWith(label));
      } else if (filter === "yearly") {
        targetLabel = labels.find((label) => entryDate.startsWith(label));
      } else {
        targetLabel = entryDate;
      }
  
      if (targetLabel && groupedData[targetLabel]) {
        groupedData[targetLabel].push({
          // cost: item.report.cost || 0,
          impression: item.report.impression || 0,
          click: item.report.click || 0,
        });
      }
    });

    return groupedData;
  };

  const isDailyEnabled = xLabels.length > 0;
  const isWeeklyEnabled = xLabels.length >= 14;
  const isMonthlyEnabled =
    new Set(xLabels.map((date) => date.slice(0, 7))).size >= 2;
  const isYearlyEnabled =
    new Set(xLabels.map((date) => date.slice(0, 4))).size >= 2;

  const handleFilterClick = (filter) => {
    if (!["daily", "weekly", "monthly", "yearly"].includes(filter)) return;

    let newXLabels = [];
    switch (filter) {
      case "weekly":
        newXLabels = xLabels.filter((_, index) => index % 7 === 0);
        break;
      case "monthly":
        newXLabels = [
          ...new Set(
            xLabels.map((date) => date.split("-").slice(0, 2).join("-"))
          ),
        ];
        break;
      case "yearly":
        newXLabels = [...new Set(xLabels.map((date) => date.split("-")[0]))];
        break;
      case "daily":
      default:
        newXLabels = generateDateRange(startDate, endDate).slice(0, 31);
    }

    const groupedData = groupDataByFilter(filteredData, newXLabels, filter);
    setXLabels(newXLabels);
    setGroupedData(groupedData);
    setActiveFilter(filter);
  };

  const chartData = {
    labels: xLabels,
    datasets: Object.keys(keyColors).map((key) => ({
      label: key,
      data: xLabels.map((label) => 
        groupedData[label] ? groupedData[label].map(item => item[key]) : []
      ).flat(),
      borderColor: keyColors[key],
      fill: false,
      tension: 0.3,
    })),
  };

  function getPerformanceType(report) {
    if (report === null) {
      return "Tidak ada data";
    } else if (report == "bad") {
      return "Bad Performance";
    } else {
      return "Good Performance";
    }
  }

  const handleDownloadCSV = () => {
    const dataToExport = filteredData.map((product, index) => ({
      No: index + 1,
      Produk: product.title,
      Modal: product.report.cost.toLocaleString(),
      Performance: product.performance_type ?? "Tidak ada data",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performa Produk");
    XLSX.writeFile(workbook, "performa_produk.xlsx");
  };

  return (
    <>
      <DashboardLayout>
        <div className="container">
          <h2 className="fw-semibold">Performa Produk</h2>
          <div className="d-flex justify-content-between mb-4">
            {/* button filter data chart */}
            <div className="d-flex gap-2 align-items-end">
              <ButtonFilterChart
                onClick={() => handleFilterClick("daily")}
                disabled={!isDailyEnabled}
                isActive={activeFilter === "daily"}
                isConditionMet={isDailyEnabled}
              >
                Daily
              </ButtonFilterChart>
              <ButtonFilterChart
                onClick={() => handleFilterClick("weekly")}
                disabled={!isWeeklyEnabled}
                isActive={activeFilter === "weekly"}
                isConditionMet={isWeeklyEnabled}
              >
                Weekly
              </ButtonFilterChart>
              <ButtonFilterChart
                onClick={() => handleFilterClick("monthly")}
                disabled={!isMonthlyEnabled}
                isActive={activeFilter === "monthly"}
                isConditionMet={isMonthlyEnabled}
              >
                Monthly
              </ButtonFilterChart>
              <ButtonFilterChart
                onClick={() => handleFilterClick("yearly")}
                disabled={!isYearlyEnabled}
                isActive={activeFilter === "yearly"}
                isConditionMet={isYearlyEnabled}
              >
                Yearly
              </ButtonFilterChart>
            </div>
            {/* Date Filter */}
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="row">
            <div className="col-12">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Tabel */}
          <div className="d-flex justify-content-between" style={{ marginTop: "3rem" }}>
            <h6 classNam e="pb-2 align-self-end">
              Kualitas peforma produk
            </h6>
            <button onClick={handleDownloadCSV} className="mb-3 px-4 btn btn-primary">
              Download CSV
            </button>
          </div>
          <div className="d-flex flex-column gap-2 border rounded">
            {/* Tabel header */}
            <div className="d-flex fw-bold border-bottom px-2 py-3 bg-info-subtle">
              <div style={{ flex: "0 0 50px", maxWidth: "50px" }}>No</div>
              <div style={{ flex: "0 0 650px", maxWidth: "650px" }}>Produk</div>
              <div style={{ flex: "0 0 200px", maxWidth: "200px" }}>Modal</div>
              <div style={{ flex: "0 0 300px", maxWidth: "300px" }}>
                Kualitas Performa
              </div>
            </div>
            {/* Tabel body */}
            {filteredData.length > 0 ? (
              filteredData.map((product, index) => (
                <div
                  key={index}
                  className="d-flex align-items border-bottom px-2 pb-2 pt-2"
                >
                  <div style={{ flex: "0 0 50px", maxWidth: "50px" }}>
                    {index + 1}
                  </div>
                  <div
                    className="d-flex flex-column pe-2 gap-1"
                    style={{
                      flex: "0 0 650px",
                      maxWidth: "650px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    <img
                      src={
                        `https://down-id.img.susercontent.com/file/` +
                        product.image
                      }
                      alt={product.name}
                      className="rounded"
                      style={{ width: "70px", height: "70px" }}
                    />
                    {product.title}
                  </div>
                  <div style={{ flex: "0 0 150px", maxWidth: "150px" }}>
                    Rp.{product.report.cost.toLocaleString()}
                  </div>
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      height: "fit-content",
                    }}
                  >
                    {
                      product.performance_type === null ? "" : product.performance_type === "bad" ? 
                      <div className="tabel-performance-circle" style={{ backgroundColor: "#FF0000" }}></div>
                      : <div className="tabel-performance-circle" style={{ backgroundColor: "#00FF00" }}></div>
                    }
                    {getPerformanceType(product.performance_type)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-muted">
                Tidak ada produk yang ditemukan.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};