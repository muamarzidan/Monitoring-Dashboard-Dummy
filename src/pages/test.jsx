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
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const labels = generateDateRange(startDate, endDate);
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    const data = dataProduct;
    setFilteredData(data.data.data.entry_list);
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

  function getPerformanceColor(report) {
    if (report === null) {
      return "";
    } else if (report == "bad") {
      return (
        <div
          className="tabel-performance-circle"
          style={{ backgroundColor: "#FF0000" }}
        ></div>
      );
    } else {
      return (
        <div
          className="tabel-performance-circle"
          style={{ backgroundColor: "#00FF00" }}
        ></div>
      );
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className="container">
          <h2 className="pb-3 fw-semibold">Performa Produk</h2>
          {/* Tabel */}
          <h6 className="pb-2" style={{ marginTop: "3rem" }}>
            Kualitas peforma produk
          </h6>
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
                    {getPerformanceColor(product.performance_type)}
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