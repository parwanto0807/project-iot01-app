"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface DataItem {
    id: number;
    serialNumberPart: string;
    voltase: number;
    ampere: number;
}

export default function Home() {
    const [data, setData] = useState<DataItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:1880/your-websocket-endpoint'); // Ganti dengan endpoint WebSocket Anda

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            const newData: DataItem = JSON.parse(event.data);
            setData((prevData) => [...prevData, newData]); // Menambahkan data baru ke state
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Error connecting to WebSocket');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close(); // Menutup koneksi WebSocket saat komponen unmounted
        };
    }, []);

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Data Pengukuran Ampere</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Serial Number</th>
                        <th>Voltase (V)</th>
                        <th>Ampere (A)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.serialNumberPart}</td>
                            <td>{item.voltase}</td>
                            <td>{item.ampere}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}