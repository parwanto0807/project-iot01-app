// components/Speedometer.tsx

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface SpeedometerProps {
    value: number;      // Nilai saat ini
    minValue: number;   // Nilai minimum
    maxValue: number;   // Nilai maksimum
    label: string;      // Label untuk spedometer
}

const Speedometer: React.FC<SpeedometerProps> = ({ value, minValue, maxValue, label }) => {
    // Normalisasi nilai ke dalam rentang [minValue, maxValue]
    const adjustedValue = Math.max(minValue, Math.min(value, maxValue));
    const percentage = ((adjustedValue - minValue) / (maxValue - minValue)) * 100;

    // Data untuk chart
    const data = [
        { name: 'Current', value: percentage, fill: '#4caf50' }, // Warna untuk nilai saat ini
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                barSize={35}
                data={data}
                startAngle={180}
                endAngle={0} // Membentuk separuh lingkaran
            >
                <PolarAngleAxis
                    type="number"
                    domain={[0, 120]} // Mengatur domain untuk 0-100
                    angleAxisId={0}
                    tick={false}
                />
                <RadialBar
                    background
                    dataKey="value"
                />
                {/* Label Tengah */}
                <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff" // Warna font putih
                    fontSize="24"
                    fontWeight="bold"
                >
                    {adjustedValue} {label}
                </text>
                <text
                    x="50%"
                    y="70%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#757575" // Warna font untuk label
                    fontSize="16"
                >
                    {label}
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
};

export default Speedometer;