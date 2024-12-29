"use client";

import { useEffect, useState } from 'react';
import styles from '@/app/page.module.css'; // Pastikan Anda membuat file CSS ini

interface DataItem {
    id: number;
    serialNumberPart: string;
    voltase: number;
    ampere: number;
}

export default function Home() {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const response = await fetch('/api/data');
                //membaca dari API Node-RED
                 const response = await fetch('mqtt://97xvrcpgto4fq9ut5a4m.cedalo.cloud:1883');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result: DataItem[] = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <main className={styles.container}>
            <h1>Data Pengukuran Ampere</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Serial Number</th>
                        <th>Voltase (V)</th>
                        <th title="Current in Amperes">Ampere (A)</th>
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