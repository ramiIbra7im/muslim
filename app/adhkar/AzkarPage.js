"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import styles from "./AzkarPage.module.css";
import HeroSection from "../components/HeroSection";

export default function AzkarPage({ type }) {
    const [items, setItems] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [finishedIdx, setFinishedIdx] = useState(null);
    const [title, setTitle] = useState("");

    const jsonUrl = "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json";

    useEffect(() => {
        setLoading(true);
        setShowLoading(false);
        const timeout = setTimeout(() => setShowLoading(true), 500);

        fetch(jsonUrl)
            .then((r) => r.json())
            .then((data) => {
                const decodedType = decodeURIComponent(type || ""); // نفك تشفير الرابط

                const categoryExists = data.find((item) => item.category === decodedType)?.category;

                if (!categoryExists) {
                    setItems([]);
                    setCounts({});
                    setTitle("غير موجود");
                    setLoading(false);
                    return;
                }

                setTitle(categoryExists);

                const selected = data.filter((item) => item.category === categoryExists);
                const allDhikr = selected.flatMap((item) => item.array ?? []);
                setItems(allDhikr);

                const initialCounts = allDhikr.reduce((acc, z, i) => {
                    const n = parseInt(z?.count ?? "1", 10);
                    acc[i] = Number.isNaN(n) || n <= 0 ? 1 : n;
                    return acc;
                }, {});
                setCounts(initialCounts);

                setLoading(false);
            })
            .catch(() => {
                setItems([]);
                setCounts({});
                setTitle("حدث خطأ");
                setLoading(false);
            });

        return () => clearTimeout(timeout);
    }, [type]);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("تم نسخ الذكر!");
        } catch {
            toast.error("تعذّر النسخ");
        }
    };

    const decrementCount = (idx) => {
        setCounts((prev) => {
            const newCounts = { ...prev };
            if (newCounts[idx] > 0) {
                newCounts[idx] -= 1;
                if (newCounts[idx] === 0) setFinishedIdx(idx);
            }
            return newCounts;
        });
    };

    useEffect(() => {
        if (finishedIdx !== null) {
            toast.success("أحسنت! أنهيت هذا الذكر.");
            setFinishedIdx(null);
        }
    }, [finishedIdx]);

    if (loading && showLoading)
        return (
            <LoadingScreen
                show={loading && showLoading}
                color="#18a999"
                message="جاري التحضير..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر"]}
                intervalMs={2000}
                dim={0.85}
            />
        );

    return (
        <>
            <HeroSection title={title} />
            <div className={`${styles["azkar-main"]} container py-3`} dir="rtl">
                <Toaster position="top-center" />

                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb  p-2 rounded ">
                        <li className="breadcrumb-item">
                            <Link href="/adhkar" className="text-decoration-none text-primary fw-bold">
                                الرئيسية
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/adhkar" className="text-decoration-none text-primary fw-bold">
                                الأذكار
                            </Link>
                        </li>
                        <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
                            {title}
                        </li>
                    </ol>
                </nav>


                <h1 className="text-center mb-4 mt-3 fw-bold"></h1>

                <div className="d-flex flex-column align-items-center">
                    {items.map((z, idx) => {
                        const text = z?.text ?? "";
                        const current = counts[idx] ?? 1;

                        return (
                            <div key={idx} className={`card shadow mb-4 col-sm-10 rounded-3 p-3 ${styles.azkarCard}`}>
                                <div className="card-body">
                                    <h4 className={`${styles.textAzkar} card-text lh-lg`}>{text}</h4>

                                    <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap mt-4">

                                        <button
                                            className={`btn btn-outline-success btn-sm px-4 fw-bold rounded-pill shadow-sm ${styles.copyBtn}`}
                                            onClick={() => copyToClipboard(text)}
                                        >
                                            نسخ
                                        </button>
                                        <button
                                            className={`btn btn-success btn-sm px-4 fw-bold rounded-pill shadow-sm ${styles.countBtn}`}
                                            onClick={() => decrementCount(idx)}
                                            disabled={current === 0}
                                        >
                                            التكرار: {current}
                                        </button>
                                    </div>


                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
