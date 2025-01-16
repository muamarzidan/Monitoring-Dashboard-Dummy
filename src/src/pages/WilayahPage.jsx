import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWilayahDate from '../components/chartWilayah';

const WilayahPage = () => {
    return (
        <DashboardLayout>
            <h1 className="pb-2">Produk Per Wilayah</h1>
            <div className="bg-body p-4 rounded-3">
                <div className="d-flex flex-column">
                    <ChartWilayahDate />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WilayahPage;