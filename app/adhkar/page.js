"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import styles from "./AzkarPage.module.css";
import { AlertHeading } from "react-bootstrap";

export default function AzkarHome() {
    const [azkarList, setAzkarList] = useState([]);

    useEffect(() => {
        const jsonUrl =
            "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json";
        fetch(jsonUrl)
            .then((r) => r.json())
            .then((data) => {
                const categories = Array.from(new Set(data.map((d) => d.category)));
                const list = categories.map((c) => ({
                    href: `/adhkar/${encodeURIComponent(c)}`,
                    label: c,
                }));
                setAzkarList(list);
            })
            .catch(() => setAzkarList([]));
    }, []);

    return (
        <div>
            <HeroSection title="الأذكار" subtitle="زاد الروح وطمأنينة القلب" />

            <div className="container-fluid p-4">
                <div className="row g-4">
                    {azkarList.map((item, index) => (
                        <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                            <Link href={item.href} className="text-decoration-none">
                                <div className={`card text-center shadow-sm ${styles.cardCustom}`}>
                                    <p className={`mb-0 ${styles.customGreen}`}>
                                        {item.label}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
