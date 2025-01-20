import React from 'react'
import DashboardLayout from '../components/DashboardLayout';
import AdsTable from '../components/adsTable';
import jsonData from '../api/dummyAds.json';
// import ChartWilayahDate3 from '../components/chartWilayah3';

export default function IklanPage() {
    return (
        <DashboardLayout>
            <h1 className="pb-1 fw-bold">Halaman Iklan</h1>
            <div className="bg-body p-4 rounded-3">
                <div className="d-flex flex-column gap-3">
                    <AdsTable data={jsonData.data} />
                </div>
            </div>
        </DashboardLayout>
    )
};