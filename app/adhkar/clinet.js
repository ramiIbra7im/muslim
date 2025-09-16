"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import styles from "./AzkarPage.module.css";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";


export default function AzkarHome() {
    const [azkarList, setAzkarList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jsonUrl =
            "https://raw.githubusercontent.com/wdalgrb/azkar-api/main/azkar.json";

        fetch(jsonUrl)
            .then((res) => res.json())
            .then((data) => {
                const categories = Object.keys(data);
                const list = categories.map((c) => ({
                    href: `/adhkar/${encodeURIComponent(c)}`,
                    label: c,
                }));
                setAzkarList(list);
            })
            .catch(() => setAzkarList([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <LoadingScreen
                show={loading}
                color="#18a999"
                message="جاري التحميل..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "لا حول ولا قوة إلا بالله"]}
                intervalMs={1000}
                dim={1}
            />
        );

    return (
        <div>
            <HeroSection title="الأذكار" subtitle="زاد الروح وطمأنينة القلب" />
            <div className={`${styles['azkar-main']} container-fluid p-4 min-vh-100`}>
                <div className="row g-4">
                    {azkarList.map((item, index) => (
                        <div key={index} className="col-lg-4 col-md-4 col-sm-6">
                            <Link href={item.href} className="text-decoration-none">
                                <div className={`text-center shadow-sm border h-100 ${styles.cardCustom}`}>
                                    <p className={`mb-0 ${styles.customGreen}`}>{item.label}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
