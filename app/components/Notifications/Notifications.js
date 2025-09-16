"use client";
import { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { FaMosque } from "react-icons/fa";
import styles from './PrayerNotifications.module.css';

export default function PrayerNotifications({ nextPrayer, countdown }) {
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const audioRef = useRef(null);
    const [stars, setStars] = useState([]);

    // توليد النجوم
    useEffect(() => {
        const newStars = [...Array(80)].map(() => ({
            size: Math.random() * 3 + 1,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 5 + 5,
            x: `${Math.random() * 200 - 100}px`
        }));
        setStars(newStars);
    }, []);

    // تشغيل الأذان تلقائي عند وصول العد التنازلي للصفر
    useEffect(() => {
        if (!countdown) return;

        // تحويل النص "X ساعة Y دقيقة Z ثانية" لأرقام
        const matches = countdown.match(/(\d+)/g);
        if (matches) {
            const [h, m, s] = matches.map(Number);
            if (h === 0 && m === 0 && s === 0) {
                playAdhan();
            }
        }
    }, [nextPrayer, countdown]);

    const playAdhan = () => {
        const prayerName = nextPrayer || "الفجر"; // اسم الصلاة القادمة
        setModalText(`الأذان الآن لصلاة ${prayerName}`);
        setShow(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => console.log("يجب الضغط على زر لتشغيل الصوت"));
        }

        setTimeout(() => setShow(false), 30000);
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="https://www.islamcan.com/audio/adhan/azan12.mp3"
                preload="auto"
            />

            {/* زر تجربة الأذان */}
            {/* <Button
                className="mb-3"
                onClick={playAdhan}
            >
                تجربة الأذان
            </Button> */}

            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
                dialogClassName={styles.prayerModalDialog}
            >
                <Modal.Body className={styles.prayerModalBody}>
                    <div className={styles.overlay}></div>

                    <div className={styles.stars}>
                        {stars.map((s, i) => (
                            <div
                                key={i}
                                className={styles.star}
                                style={{
                                    width: `${s.size}px`,
                                    height: `${s.size}px`,
                                    left: `${s.left}%`,
                                    bottom: '-10px',
                                    animationDelay: `${s.delay}s`,
                                    animationDuration: `${s.duration}s`,
                                    '--x': s.x
                                }}
                            />
                        ))}
                    </div>

                    <div className={styles.content}>
                        <div className={styles.title}><FaMosque /> 🕌 أذان</div>
                        <div className={styles.text}>{modalText}</div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
