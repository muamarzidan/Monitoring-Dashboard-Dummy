import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWilayahDate from '../components/chartWilayah';
import ChartWilayahDate2 from '../components/chartWilayah2';
import ChartWilayahDate3 from '../components/test';

const WilayahPage = () => {
    return (
        <DashboardLayout>
            <h1 className="pb-2">Produk Per Wilayah</h1>
            <div className="d-flex flex-column gap-4">
                <div className="bg-body p-4 rounded-3">
                    <div className="d-flex flex-column">
                        <ChartWilayahDate />
                    </div>
                </div>
                <div className="bg-body p-4 rounded-3">
                    <div className="d-flex flex-column">
                        <ChartWilayahDate2 />
                    </div>
                </div>
                <div className="bg-body p-4 rounded-3">
                    <div className="d-flex flex-column">
                        <ChartWilayahDate3 />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WilayahPage;