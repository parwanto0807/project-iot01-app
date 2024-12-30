// components/LineChartComponent.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartComponentProps {
    data: { name: string; voltase: number; ampere: number }[]; // Struktur data yang diterima
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="90%" height={300}>
            <LineChart data={data} style={{ backgroundColor: '#1e1e1e' }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line 
                    type="monotone" 
                    dataKey="voltase" 
                    stroke="#4caf50" 
                    activeDot={{ r: 8 }} 
                    dot={{ stroke: '#4caf50', strokeWidth: 2 }} // Menambahkan titik pada grafik
                    strokeWidth={2} // Menyesuaikan lebar garis
                />
                <Line 
                    type="monotone" 
                    dataKey="ampere" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    dot={{ stroke: '#8884d8', strokeWidth: 2 }} // Menambahkan titik pada grafik
                    strokeWidth={2} // Menyesuaikan lebar garis
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;