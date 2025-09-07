"use client";
import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

/**
 * LoadingScreen
 * Props:
 * - show: boolean (إظهار/إخفاء)
 * - color: string (لون العناصر، افتراضي #18a999)
 * - message: string (رسالة أساسية)
 * - dhikr: string[] (قائمة أذكار تتبدل)
 * - intervalMs: number (مدة تبديل الذكر)
 * - dim: number (درجة تعتيم الخلفية 0 → 1)
 */
export default function LoadingScreen({
    show = true,
    color = "#18a999",
    message = "جاري التحميل...",
    dhikr = ["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر"],
    intervalMs = 1600,
    dim = 0.85,
}) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (!show) return;
        const t = setInterval(() => {
            setIdx((i) => (i + 1) % dhikr.length);
        }, intervalMs);
        return () => clearInterval(t);
    }, [show, dhikr.length, intervalMs]);

    if (!show) return null;

    return (
        <div
            className={`${styles.overlay} position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center`}
            style={{ backgroundColor: `rgba(10, 13, 15, ${dim})` }}
            aria-live="polite"
            role="status"
        >
            <div className="text-center">

                {/* الدائرة الأساسية مع “المسبحة” الدوارة */}
                <div className={`${styles.halo} rounded-circle d-inline-flex align-items-center justify-content-center mb-4`}>
                    {/* هلال + نجمة (SVG) */}
                    <svg
                        className={styles.crescent}
                        width="96"
                        height="96"
                        viewBox="0 0 96 96"
                        aria-hidden="true"
                        style={{ color }}
                    >
                        {/* هلال */}
                        <path
                            d="M60 88a40 40 0 1 1 0-80 34 34 0 1 0 0 80z"
                            fill="currentColor"
                            opacity="0.95"
                        />
                        {/* نجمة */}
                        <path
                            d="M70 20l3.2 9.8H84l-8 5.8 3 9.6-9-6.2-9 6.2 3-9.6-8-5.8h10.8L70 20z"
                            fill="currentColor"
                            opacity="0.85"
                        />
                    </svg>

                    {/* خرز المسبحة يدور حول الدائرة */}
                    <div className={styles.beads} style={{ borderColor: color }}>
                        {Array.from({ length: 16 }).map((_, i) => (
                            <span
                                key={i}
                                className={styles.bead}
                                style={{ backgroundColor: color, transform: `rotate(${i * (360 / 16)}deg) translateY(-56px)` }}
                            />
                        ))}
                    </div>
                </div>

                {/* الرسائل */}
                <div className="text-white">
                    <div className="fw-bold fs-5 mb-1">{message}</div>
                    <div className={`${styles.dhikr} opacity-75`}>{dhikr[idx]}</div>
                </div>

                {/* شريط تقدم بسيط */}
                {/* <div className="mt-4 mx-auto" style={{ maxWidth: 260 }}>
                    <div className="progress bg-dark" style={{ height: 6, borderRadius: 999 }}>
                        <div
                            className={styles.progressBar}
                            style={{ backgroundColor: color }}
                        />
                    </div>
                </div> */}

            </div>
        </div>
    );
}
