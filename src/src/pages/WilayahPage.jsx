import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWilayahDate from '../components/chartWilayah';

const WilayahPage = () => {
    return (
        <DashboardLayout>
            <ChartWilayahDate />
        </DashboardLayout>
    );
};

export default WilayahPage;