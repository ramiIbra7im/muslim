"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./QuranViewer.module.css";
import QuranCover from "../components/QuranCover";
import AutoScrollControl from "../components/AutoScrollControl";

export default function QuranViewer() {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [verses, setVerses] = useState([]);
    const [basmala, setBasmala] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);

    // المقرئين
    const reciters = [
        { id: 1, name: "عبد الباسط عبد الصمد", identifier: "ar.abdulbasitmurattal" },
        { id: 2, name: "مشاري راشد العفاسي", identifier: "ar.alafasy" },
    ];
    const [selectedReciter, setSelectedReciter] = useState(reciters[0]);

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const containerRef = useRef(null);
    const [scrollSpeed, setScrollSpeed] = useState(1);

    // جلب قائمة السور
    useEffect(() => {
        fetch("https://api.alquran.cloud/v1/surah")
            .then((res) => res.json())
            .then((data) => setSurahs(data.data))
            .catch(() => setSurahs([]));
    }, []);

    // جلب النص عند اختيار السورة
    useEffect(() => {
        if (!selectedSurah) return;

        fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/editions/quran-uthmani`
        )
            .then((res) => res.json())
            .then((data) => {
                const ayahs = data.data[0].ayahs;

                let basmalaText = "";
                let remainingText = ayahs[0].text;
                const endIndex = ayahs[0].text.indexOf("ٱلرَّحِيمِ");
                if (endIndex !== -1) {
                    basmalaText = ayahs[0].text
                        .slice(0, endIndex + "ٱلرَّحِيمِ".length)
                        .trim();
                    remainingText = ayahs[0].text
                        .slice(endIndex + "ٱلرَّحِيمِ".length)
                        .trim();
                    ayahs[0].text = remainingText;
                }

                setBasmala(basmalaText);
                setVerses(ayahs);

                if (selectedReciter) {
                    audioRef.current = new Audio(
                        `https://cdn.islamic.network/quran/audio-surah/128/${selectedReciter.identifier}/${selectedSurah.number}.mp3`
                    );

                    audioRef.current.ontimeupdate = () => {
                        setProgress(
                            (audioRef.current.currentTime / audioRef.current.duration) * 100
                        );
                    };
                    audioRef.current.onended = () => setIsPlaying(false);
                    setIsPlaying(false);
                }
            })
            .catch(() => setVerses([]));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setIsPlaying(false);
            setProgress(0);
        };
    }, [selectedSurah, selectedReciter]);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div dir="ltr" className={`container-fluid   ${styles.quranLayout}`}>
            <div className="row h-100">
                {/* Sidebar (للديسكتوب فقط) */}
                <div
                    className={`overflow-auto p-3 d-none d-md-block ${styles.sidebar} col-md-2`}
                >
                    {surahs.map((s) => (
                        <div
                            key={s.number}
                            className={`p-2 mb-2 ${styles.surahItem} ${selectedSurah?.number === s.number ? styles.activeSurah : ""
                                }`}
                            onClick={() => {
                                setSelectedSurah(s);
                            }}
                        >
                            <div className="d-flex flex-column align-items-end">
                                <span>{s.name}</span>
                                <small className="pt-1">{s.numberOfAyahs} آية</small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* منطقة العرض */}
                <div
                    ref={containerRef}
                    className={`col-12 col-md-10 overflow-auto p-0  ${styles.content}`}
                >

                    {/* المودال */}
                    {showSidebar && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
                            style={{ zIndex: 2000 }}
                            onClick={() => setShowSidebar(false)}
                        >
                            <div
                                className="bg-white rounded shadow p-3 w-75 h-75 overflow-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="m-0">قائمة السور</h5>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        ✖
                                    </button>
                                </div>

                                {surahs.map((s) => (
                                    <div
                                        key={s.number}
                                        className={`p-2 mb-2 ${styles.surahItem} ${selectedSurah?.number === s.number
                                            ? styles.activeSurah
                                            : ""
                                            }`}
                                        onClick={() => {
                                            setSelectedSurah(s);
                                            setShowSidebar(false);
                                        }}
                                    >
                                        <div className="d-flex flex-column align-items-end">
                                            <span>{s.name}</span>
                                            <small className="pt-1">{s.numberOfAyahs} آية</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* نافبار (ديسكتوب) */}
                    {selectedSurah && (
                        <div
                            className={`d-none d-md-flex flex-column sticky-top top-0 p-3 ${styles.nav}`}
                        >
                            <div className="d-flex flex-md-row justify-content-between align-items-center gap-2">
                                <span className="text-truncate fw-bold">
                                    {selectedSurah.name} / {selectedReciter?.name}
                                </span>

                                <div className="d-flex align-items-center gap-3">
                                    <button
                                        className={`btn btn-sm ${styles.audioButton}`}
                                        onClick={toggleAudio}
                                    >
                                        {isPlaying ? "إيقاف" : "تشغيل"}
                                    </button>

                                    <select
                                        className="form-select form-select-sm"
                                        value={selectedReciter?.identifier}
                                        onChange={(e) => {
                                            const rec = reciters.find(
                                                (r) => r.identifier === e.target.value
                                            );
                                            setSelectedReciter(rec);
                                        }}
                                    >
                                        {reciters.map((r) => (
                                            <option key={r.identifier} value={r.identifier}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>

                                    <AutoScrollControl
                                        containerRef={containerRef}
                                        scrollSpeed={scrollSpeed}
                                        setScrollSpeed={setScrollSpeed}
                                    />
                                </div>
                            </div>

                            <div className="progress mt-2" style={{ height: "5px" }}>
                                <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {/* نافبار الموبايل */}
                    <div className="d-md-none sticky-top bg-white p-2 border-bottom">
                        {/* السطر الأول: زرار السور دايمًا */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <button
                                className="btn btn-outline-secondary mt-2"
                                onClick={() => setShowSidebar(true)}
                            >
                                السور
                            </button>
                        </div>

                        {/* لو في سورة مختارة نظهر باقي الأدوات */}
                        {selectedSurah && (
                            <>
                                <div className="fs-6 py-1 text-truncate m-auto">
                                    {selectedSurah.name} / {selectedReciter?.name}
                                </div>

                                {/* أزرار التحكم */}
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <button
                                        className={`btn btn-sm ${styles.audioButton}`}
                                        onClick={toggleAudio}
                                    >
                                        {isPlaying ? "إيقاف" : "تشغيل"}
                                    </button>

                                    <select
                                        className="form-select form-select-sm"
                                        value={selectedReciter?.identifier}
                                        onChange={(e) => {
                                            const rec = reciters.find(r => r.identifier === e.target.value);
                                            setSelectedReciter(rec);
                                        }}
                                    >
                                        {reciters.map(r => (
                                            <option key={r.identifier} value={r.identifier}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                    {/* التحكم في الاسكرول */}
                                    <div className="">
                                        <AutoScrollControl
                                            containerRef={containerRef}
                                            scrollSpeed={scrollSpeed}
                                            setScrollSpeed={setScrollSpeed}
                                        />
                                    </div>
                                </div>



                                {/* Progress Bar */}
                                <div className="progress" style={{ height: "5px" }}>
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </>
                        )}
                    </div>



                    {!selectedSurah ? (
                        <QuranCover />
                    ) : (
                        <div className="bg-light rounded border col-12 col-lg-8 shadow-sm p-2 m-auto ">
                            {basmala && (
                                <div className="text-center mb-4">
                                    <span className={styles.basmala}>{basmala}</span>
                                </div>
                            )}
                            <div className={`${styles.ayahContainer}`}>
                                {verses.map((v) => (
                                    <span key={v.numberInSurah} className={styles.ayah}>
                                        {v.text}{" "}
                                        <span className={`${styles.ayahNumber} fw-bold`}>
                                            &#x06DD;{v.numberInSurah}
                                        </span>

                                    </span>
                                ))}
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
