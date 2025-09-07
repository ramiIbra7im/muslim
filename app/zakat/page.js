"use client";

import React, { useState, useEffect } from "react";
import styles from "./ZakatCalculator.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ZakatCalculator() {
    const [type, setType] = useState("cash");
    const [amount, setAmount] = useState("");
    const [goldGrams, setGoldGrams] = useState("");
    const [goldPricePerGram, setGoldPricePerGram] = useState("");
    const [silverGrams, setSilverGrams] = useState("");
    const [silverPricePerGram, setSilverPricePerGram] = useState("");
    const [agriKg, setAgriKg] = useState("");
    const [agriIrrigated, setAgriIrrigated] = useState(false);
    const [result, setResult] = useState(null);

    const fmt = (v) => Number(v).toLocaleString();

    useEffect(() => {
        setResult(null); // مسح النتيجة عند تغيير التبويب
    }, [type]);

    // === الحسابات ===
    function calcCashZakat() {
        const silverNisabGrams = 595;
        const goldNisabGrams = 85;

        const silverValue = (silverGrams || 0) * (silverPricePerGram || 0);
        const goldValue = (goldGrams || 0) * (goldPricePerGram || 0);
        const net = Number(amount || 0) + goldValue + silverValue;

        let nisabValue = 0;
        if (goldPricePerGram > 0) nisabValue = goldNisabGrams * goldPricePerGram;
        else if (silverPricePerGram > 0) nisabValue = silverNisabGrams * silverPricePerGram;

        if (nisabValue === 0) {
            toast.warn(" أدخل سعر الذهب أو الفضة لحساب النصاب");
            return { due: null, net, nisabValue };
        }
        if (net >= nisabValue) {
            const due = (net * 2.5) / 100;
            return { due, net, nisabValue, note: null };
        }
        if (net < nisabValue) {
            toast.error(" المبلغ أقل من النصاب فلا زكاة");
            return { due: 0, net, nisabValue };
        }
    }

    function calcAgriZakat() {
        const kg = Number(agriKg || 0);
        if (kg <= 0) return { due: 0, rate: null };
        const rate = agriIrrigated ? 0.05 : 0.1;
        const due = kg * rate;
        return { due, rate };
    }

    function handleCalculate(e) {
        e.preventDefault();
        if (type === "cash") setResult({ mode: "cash", ...calcCashZakat() });
        else if (type === "agri") setResult({ mode: "agri", ...calcAgriZakat() });
    }

    return (
        <div className={`${styles.container} container-fluid py-4 min-vh-100 d-flex align-items-center justify-content-center`}>
            <div className="card shadow p-4 col-sm-12 col-lg-8 m-auto ">


                {/* أزرار التبويب */}
                <div className="btn-group d-flex mb-4 gap-3">
                    <button
                        onClick={() => setType("cash")}
                        className={`btn ${type === "cash" ? styles.activeBtn : styles.btnOutlineCustom}`}
                    >
                        زكاة المال والذهب والفضة
                    </button>
                    <button
                        onClick={() => setType("agri")}
                        className={`btn ${type === "agri" ? styles.activeBtn : styles.btnOutlineCustom}`}
                    >
                        زكاة الزرع
                    </button>
                </div>

                {/* نموذج الحساب */}
                <form onSubmit={handleCalculate}>
                    {type === "cash" && (
                        <>
                            {/* النقد */}
                            <div className="mb-3">
                                <label className={styles["form-label"]}> النقد</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    placeholder="أدخل إجمالي النقد"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            {/* الذهب */}
                            {/* <h5 className={styles.sectionTitle}> الذهب</h5> */}
                            <div className="row g-2">
                                <div className="col">
                                    <label className={styles["form-label"]}>سعر الذهب (غ)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="سعر الغرام"
                                        value={goldPricePerGram}
                                        onChange={(e) => setGoldPricePerGram(e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <label className={styles["form-label"]}>وزن الذهب (غ)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="النصاب 85 غرام"
                                        value={goldGrams}
                                        onChange={(e) => setGoldGrams(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* الفضة */}
                            {/* <h5 className={styles.sectionTitle}>
                                الفضة
                            </h5> */}
                            <div className="row g-2 mt-3">
                                <div className="col">
                                    <label className={styles["form-label"]}>سعر الفضة (غ)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="سعر الغرام"
                                        value={silverPricePerGram}
                                        onChange={(e) => setSilverPricePerGram(e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <label className={styles["form-label"]}>وزن الفضة (غ)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="النصاب 595 غرام"
                                        value={silverGrams}
                                        onChange={(e) => setSilverGrams(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {type === "agri" && (
                        <>
                            <div className="mb-3">
                                <label className={styles["form-label"]}> وزن المحصول (كجم)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    placeholder="أدخل وزن المحصول"
                                    value={agriKg}
                                    onChange={(e) => setAgriKg(e.target.value)}
                                />
                            </div>
                            <div className="col-6  ">
                                <input
                                    type="checkbox"
                                    id="irrigated"
                                    className="m-2 p-4 "
                                    checked={agriIrrigated}
                                    onChange={(e) => setAgriIrrigated(e.target.checked)}
                                />
                                <label htmlFor="irrigated" className="form-check-label">
                                    طريقة الري: صناعي  5%
                                </label>
                            </div>
                        </>
                    )}

                    <div className="d-flex justify-content-center mt-3">
                        <button
                            type="submit"
                            className={`btn col-4  ${styles.calcBtn}`}
                        >
                            احسب
                        </button>
                    </div>

                </form>

                {/* النتائج */}
                {result && (
                    <div className={`mt-4 ${styles.resultBox}`}>
                        {result.mode === "cash" && (
                            <>
                                {/* <h5 className="mb-3 text-center fw-bold">نتيجة زكاة المال</h5> */}
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>الصافي الكلي</span>
                                                <span className="fw-bold">{fmt(result.net)} ج</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>النصاب</span>
                                                <span className="fw-bold">{result.nisabValue ? fmt(result.nisabValue) : "غير محدد"} ج</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>الزكاة الواجبة</span>
                                                {result.due > 0 ? (
                                                    <span className="fw-bold text-success">{fmt(result.due)} ج</span>
                                                ) : (
                                                    <span className="fw-bold text-muted">لا يوجد زكاة</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {result.mode === "agri" && (
                            <>
                                {/* <h5 className="mb-3 text-center fw-bold"> زكاة الزروع</h5> */}
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>الكمية</span>
                                                <span className="fw-bold">{fmt(agriKg)} كجم</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>النسبة المطبقة</span>
                                                <span className="fw-bold">{result.rate * 100}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3 shadow-sm">
                                            <div className="d-flex justify-content-between">
                                                <span>الزكاة الواجبة</span>
                                                <span className="fw-bold text-success">{fmt(result.due)} كجم</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
}
