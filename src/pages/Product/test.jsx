import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
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
import Papa from "papaparse";

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
    setFilteredData(data.data.data.entry_list);
  };

  const keyColors = {
    // cost: "hsl(120, 70%, 50%)",
    impression: "hsl(0, 70%, 50%)",
    click: "hsl(240, 70%, 50%)",
  };  

  const groupDataByFilter = (data, labels, filter) => {
    const groupedData = {};
    
    labels.forEach((label) => {
      groupedData[label] = { cost: 0, impression: 0, click: 0 };
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
        Object.keys(keyColors).forEach((key) => {
          groupedData[targetLabel][key] += item.report[key] || 0;
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
      data: xLabels.map((label) => groupedData[label]?.[key] || 0),
      borderColor: keyColors[key],
      fill: false,
      tension: 0.3,
    })),
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
              {/* and another button filter */}
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
        </div>
      </DashboardLayout>
    </>
  );
};