"use client";
import { useState, useRef } from "react";
import styles from "./TasbeehCounter.module.css";

export default function TasbeehCounter() {
    const [count, setCount] = useState(0);
    const [zekr, setZekr] = useState("سبحان الله");
    const soundRef = useRef(null);

    const inc = () => {
        setCount(c => (c >= 100 ? 0 : c + 1));
        if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play();
        }
    };

    const reset = () => setCount(0);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className={`${styles.tasbeehCard} card shadow border p-4 col-lg-6 col-10`}>

                {/* حقل التسبيحة */}
                <div className="mb-4">
                    <input
                        type="text"
                        className={`${styles.inputZekr} form-control form-control-lg text-center fw-bold`}
                        value={zekr}
                        onChange={(e) => setZekr(e.target.value)}
                        placeholder="اكتب التسبيحة هنا"
                    />
                </div>

                {/* عداد دائري */}
                <div className="d-flex justify-content-center mb-4">
                    <div className={`${styles.counterCircle} rounded-circle d-flex align-items-center justify-content-center`}>
                        <span className="display-3 fw-bold text-white">{count}</span>
                    </div>
                </div>

                {/* التسبيحة */}
                <h5 className="text-center mb-4 fw-bold" style={{ color: "#2e5f3e" }}>{zekr}</h5>

                {/* أزرار */}
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button className={`${styles.btnGreen} btn-lg rounded-pill p-3`} onClick={inc}>
                        تسبيح
                    </button>
                    <button className={`${styles.btnRed} btn-lg rounded-pill p-3`} onClick={reset}>
                        تصفير
                    </button>
                </div>


            </div>
        </div>
    );
}
