import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function MerchantPage() {
  const [kpiData, setKpiData] = useState(() => {
    const savedData = localStorage.getItem("kpiData");
    return savedData
      ? JSON.parse(savedData)
      : [
          { name: "ROAS", value: 0, newValue: 0 },
          { name: "Bidding", value: 0, newValue: 0 },
          { name: "CPS", value: 0, newValue: 0 },
          { name: "ACOS", value: 0, newValue: 0 },
          { name: "CTR", value: 0, newValue: 0 },
          { name: "CR", value: 0, newValue: 0 },
          { name: "ATC to CPR", value: 0, newValue: 0 },
          { name: "Cost", value: 0, newValue: 0 },
        ];
  });

  useEffect(() => {
    const updatedData = kpiData.map((item) => ({
      ...item,
      newValue: item.newValue || item.value,
    }));
    setKpiData(updatedData);
  }, []);

  const handleInputChange = (index, newValue) => {
    const updatedData = [...kpiData];
    updatedData[index].newValue = newValue || "";
    setKpiData(updatedData);
  };

  const handleUpdate = () => {
    const updatedData = kpiData.map((item) => ({
      ...item,
      value: item.newValue === "" ? 0 : Number(item.newValue),
      newValue: item.newValue === "" ? 0 : Number(item.newValue),
    }));
    setKpiData(updatedData);
    localStorage.setItem("kpiData", JSON.stringify(updatedData));
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <h3 className="my-1 fw-semibold">Custom KPI</h3>
        <div className="py-3eecee">
          <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded">
            <div style={{ flex: 1 }}>Nama KPI</div>
            <div style={{ flex: 1, textAlign: "center" }}>Value</div>
            <div style={{ flex: 1, textAlign: "center" }}>New Value</div>
          </div>
          {kpiData.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center bg-light p-3 mt-2 rounded"
            >
              <div style={{ flex: 1 }}>{item.name}</div>
              <div style={{ flex: 1, textAlign: "center" }}>{item.value}</div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <input
                  type="number"
                  className="form-control"
                  value={item.newValue}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button className="fw-semibold btn btn-info w-100 mt-3" style={{padding: "12px", color: "#272727FF"}} type="submit" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};