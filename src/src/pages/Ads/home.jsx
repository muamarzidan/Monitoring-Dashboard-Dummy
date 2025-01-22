import React from 'react'
import DashboardLayout from '../../components/DashboardLayout';
// import AdsTable from '../../pages/test';
import AdsTable from '../../components/adsTable';
import jsonData from '../../api/dummyAds.json';

export default function AdsPage() {
    return (
        <DashboardLayout>
            <div className="bg-body p-4 rounded-3">
                <div className="d-flex flex-column gap-3">
                    <AdsTable data={jsonData.data} />
                </div>
            </div>
        </DashboardLayout>
    )
};