"use client";
import { FaMosque } from "react-icons/fa";
import styles from "./Countdown.module.css";

export default function Countdown({ nextPrayer, countdown }) {
    if (!nextPrayer) return null;

    return (
        <div className={`card shadow-sm border container col-11 col-sm-8 m-auto p-3 ${styles.countdownCard}`} dir="rtl">
            <div className={`d-flex align-items-center justify-content-between gap-3 ${styles.cardContent}`}>

                {/* صورة البروفايل */}
                <img
                    src="/hero.png"
                    alt="Prayer"
                    className={`rounded-circle ${styles.profileImage}`}
                />

                {/* النص + الأيقونة */}
                <div className={`text-center ${styles.textSection}`}>
                    <div className={styles.iconWrapper}>
                        <FaMosque size={28} className={styles.mosqueIcon} />
                    </div>
                    <h5 className="fw-bold mb-1">الصلاة القادمة: {nextPrayer}</h5>
                    <p className="mb-0 fw-semibold">{countdown}</p>
                </div>

            </div>
        </div>
    );
}
