import React, { useState } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { filterByDate } from '../api/data';

const ChartWilayah = () => {
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate()}`;
    });
    const [textDateRange, setTextDateRange] = useState('Tanggal Mulai - Tanggal Akhir');
    const [filteredData, setFilteredData] = useState(filterByDate(startDate, endDate));

    const handleFilter = () => {
        const startText = new Date(startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const endText = new Date(endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const updatedData = filterByDate(startDate, endDate);
        setFilteredData(updatedData);
        setTextDateRange(`${startText} - ${endText}`);
    };

    const handleReset = () => {
        const now = new Date();
        const defaultStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const defaultEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate()}`;

        setStartDate(defaultStart);
        setEndDate(defaultEnd);
        setFilteredData(filterByDate(defaultStart, defaultEnd));
        setTextDateRange('Tanggal Mulai - Tanggal Akhir');
    };

    const generateChartData = () => {
        const tanggalSet = new Set();
        filteredData.forEach((wilayah) => {
            wilayah.produkPaid.forEach((produk) => {
                tanggalSet.add(produk.tanggal);
            });
        });

        const labels = Array.from(tanggalSet).sort();
        const chartData = labels.map((tanggal) => {
            const dataPoint = { tanggal };

            filteredData.forEach((wilayah) => {
                const totalHarga = wilayah.produkPaid
                    .filter((produk) => produk.tanggal === tanggal)
                    .reduce((sum, produk) => sum + produk.harga, 0);
                dataPoint[wilayah.nama] = totalHarga;
            });

            return dataPoint;
        });

        return chartData;
    };
    const chartData = generateChartData();

    return (
        <div>
            <div className="filter d-flex justify-content-between align-items-center mb-4">
                <div className="fw-semibold fs-4">
                    {textDateRange}
                </div>
                <div className="d-flex gap-2">
                    <div className="d-flex flex-column">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 rounded"
                        />
                    </div>
                    <div className="d-flex align-items-center">-</div>
                    <div className="d-flex flex-column">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 rounded"
                        />
                    </div>
                    <button className="px-4 rounded bg-info-subtle" onClick={handleFilter}>
                        Filter
                    </button>
                    <button className="px-4 rounded bg-danger-subtle" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
            {chartData && (
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(75, 192, 192, 1)" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="rgba(75, 192, 192, 0)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="tanggal" label={{ position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                            <Legend />
                            {filteredData.map((wilayah) => (
                                <Area
                                    key={wilayah.nama}
                                    type="monotone"
                                    dataKey={wilayah.nama}
                                    stroke="rgba(75, 192, 192, 1)"
                                    fill="url(#areaGradient)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    // isAnimationActive={false}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ChartWilayah;