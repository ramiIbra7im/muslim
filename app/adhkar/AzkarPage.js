"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import HeroSection from "../components/HeroSection";
import styles from "./AzkarPage.module.css";

export default function AzkarPage({ type }) {
    const [items, setItems] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [finishedIdx, setFinishedIdx] = useState(null);
    const [title, setTitle] = useState("");

    const jsonUrl =
        "https://raw.githubusercontent.com/wdalgrb/azkar-api/main/azkar.json";

    useEffect(() => {
        setLoading(true);
        setShowLoading(false);
        const timeout = setTimeout(() => setShowLoading(true), 500);

        fetch(jsonUrl)
            .then((r) => r.json())
            .then((data) => {
                const decodedType = decodeURIComponent(type || "");
                const categoryData = data[decodedType];

                if (!categoryData) {
                    setItems([]);
                    setCounts({});
                    setTitle("غير موجود");
                    setLoading(false);
                    return;
                }

                setTitle(decodedType);

                let allDhikr = [];
                categoryData.forEach((group) => {
                    if (Array.isArray(group)) {
                        group.forEach((item) => {
                            if (!item) return;
                            if (item.content) {
                                let content = cleanText(item.content);
                                let description = cleanText(item.description ?? "");
                                if (content) allDhikr.push({ ...item, content, description });
                            } else if (typeof item === "string") {
                                let content = cleanText(item);
                                if (content) allDhikr.push({ content, description: "" });
                            }
                        });
                    } else if (typeof group === "object" && group !== null) {
                        if (group.content) {
                            let content = cleanText(group.content);
                            let description = cleanText(group.description ?? "");
                            if (content) allDhikr.push({ ...group, content, description });
                        }
                    } else if (typeof group === "string") {
                        let content = cleanText(group);
                        if (content) allDhikr.push({ content, description: "" });
                    }
                });

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

    const cleanText = (txt) =>
        String(txt)
            .replace(/\\n/g, "\n")
            .replace(/\[.*?\]/g, "")
            .replace(/(^['",\s]+)|(['",\s]+$)/g, "")
            .replace(/\.{2,}/g, "")
            .replace(/["“”]+/g, "")
            .replace(/(^\s+|\s+$)/g, "")
            .replace(/stop/, "")
            .trim();

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
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb p-2 rounded">
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

                <div className="d-flex flex-column align-items-center">
                    {items.map((z, idx) => {
                        const text = z?.content ?? "";
                        const description = z?.description ?? "";
                        const current = counts[idx] ?? 1;
                        const reference = z?.reference ?? "";

                        return (
                            <div key={idx} className={`card shadow mb-4 col-sm-12 rounded-3 col-lg-10 p-3 ${styles.azkarCard}`}>
                                <div className="card-body p-0">
                                    <h3 className={`${styles.textAzkar} card-text lh-lg`}>{text}</h3>

                                    {description && (
                                        <div className="rounded-2 p-1 shadow-sm d-inline-block ">
                                            <p className="mb-0 text-secondary lh-lg">{description}</p>
                                        </div>
                                    )}


                                    <div className="d-flex justify-content-between align-items-center flex-wrap mt-4">
                                        {/* الريفرنس */}
                                        {reference && (
                                            <p className="text-muted badge shadow-sm bg-light fw-semibold small m-0">
                                                {reference}
                                            </p>
                                        )}

                                        {/* الأزرار */}
                                        <div className="d-flex align-items-center gap-3">
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
