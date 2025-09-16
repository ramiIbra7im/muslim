"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./TasbeehCounter.module.css";

export default function TasbeehCounter() {
    const [count, setCount] = useState(0);
    const [zekr, setZekr] = useState("سبحان الله");
    const [target, setTarget] = useState(100);
    const [pulse, setPulse] = useState(false);
    const soundRef = useRef(null);

    // تحميل العدد من localStorage
    useEffect(() => {
        const savedCount = localStorage.getItem("tasbeehCount");
        if (savedCount) setCount(Number(savedCount));

        const savedTarget = localStorage.getItem("tasbeehTarget");
        if (savedTarget) setTarget(Number(savedTarget));
    }, []);

    // حفظ العدد في localStorage
    useEffect(() => {
        localStorage.setItem("tasbeehCount", count);
    }, [count]);

    // حفظ التارجت
    useEffect(() => {
        localStorage.setItem("tasbeehTarget", target);
    }, [target]);

    const inc = () => {
        setCount((c) => {
            const newCount = c >= target ? 0 : c + 1;
            return newCount;
        });

        // Pulse effect
        setPulse(true);
        setTimeout(() => setPulse(false), 300);

        // تشغيل صوت
        if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play();
        }
    };

    const reset = () => setCount(0);

    const progress = Math.min((count / target) * 100, 100);

    return (
        <div className={`${styles.main} d-flex justify-content-center align-items-center vh-100`}>
            <div className={`${styles.tasbeehCard} card shadow border p-4 col-lg-6 col-10`}>
                <div className="row mb-3">
                    {/* إدخال التسبيحة */}
                    <div className="col-6">
                        <input
                            type="text"
                            className={`${styles.inputZekr} form-control form-control-lg text-center fw-bold`}
                            value={zekr}
                            onChange={(e) => setZekr(e.target.value)}
                            placeholder="اكتب التسبيحة هنا"
                        />
                    </div>
                    {/* إدخال الهدف */}
                    <div className="col-6">
                        <input
                            type="number"
                            className={`${styles.inputZekr} form-control form-control-lg text-center fw-bold`}
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            placeholder="عدد التسبيحات المستهدف"
                        />
                    </div>
                </div>

                {/* Progress bar */}
                <div className="progress mb-3" style={{ height: "10px" }}>
                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* العداد */}
                <div className="d-flex justify-content-center my-5">
                    <div
                        className={`${styles.counterCircle} ${pulse ? styles.pulse : ""} rounded-circle d-flex align-items-center justify-content-center`}
                    >
                        <span className="display-3 fw-bold text-white">{count}</span>
                    </div>
                </div>

                {/* أزرار */}
                <div className="d-flex justify-content-between gap-3 flex-wrap mt-5">
                    <button className={`${styles.btnGreen} btn-lg rounded p-3`} onClick={inc}>
                        تسبيح
                    </button>
                    <h5 className="text-center mb-4 fw-bold" style={{ color: "#2e5f3e" }}>
                        {zekr}
                    </h5>
                    <button className={`${styles.btnRed} btn-lg rounded  p-3`} onClick={reset}>
                        تصفير
                    </button>
                </div>

                {/* صوت */}
                {/* <audio ref={soundRef} src="/click.mp3" preload="auto" /> */}
            </div>
        </div>
    );
}
