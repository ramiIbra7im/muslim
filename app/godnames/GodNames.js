"use client";
import { useEffect, useState } from "react";
import styles from "./GodNames.module.css";
import HeroSection from "../components/HeroSection";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

export default function GodNames() {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/rn0x/Names_Of_Allah_Json/main/Names_Of_Allah.json"
        )
            .then((res) => res.json())
            .then((json) => setNames(json))
            .catch((err) => console.error("خطأ في تحميل الأسماء:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <LoadingScreen
                show={loading}
                color="#18a999"
                message="جاري التحميل..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "لا حول ولا قوة إلا بالله"]}
                intervalMs={1600}
                dim={1}
            />
        );

    return (
        <>
            <HeroSection title="أسماء الله الحسنى" subtitle="ارح قلبك" />
            <div className={`container ${styles.containerCustom} py-5`}>
                <div className="row g-4">
                    {names.map((n, index) => (
                        <div key={`${n.id}-${index}`} className="col-12 col-lg-6 mx-auto">
                            <div className={`card h-100 shadow ${styles.cardCustom}`}>
                                <div className={`card-header ${styles.cardHeader}`}>
                                    <span className={styles.cardNumber}>{n.id}</span>
                                    <h3 className={styles.cardTitle}>{n.name}</h3>
                                </div>
                                <div className={`card-body ${styles.cardBodyCustom}`}>
                                    <p className={styles.cardText}>{n.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
