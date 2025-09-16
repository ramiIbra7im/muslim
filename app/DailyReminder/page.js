"use client";

import { useEffect, useState } from "react";
import styles from "./DailyQuran.module.css";

const PAGE_NUMBER = 2;

export default function QuranPage() {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/quran/page/${PAGE_NUMBER}`);
                const data = await res.json();
                setVerses(data.verses || []);
            } catch (err) {
                console.error("خطأ:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading)
        return <p className="text-center mt-5">⏳ جاري التحميل...</p>;

    return (
        <div className={`container my-4 ${styles.quranPage}`}>
            {/* كارت الصفحة */}
            <div className={`card shadow-sm mb-4 p-4 ${styles.pageCard}`}>
                <h2 className="text-center mb-4">📖 صفحة {PAGE_NUMBER}</h2>
                <div className="text-end">
                    {verses.map((v) => (
                        <span key={v.id} className={`mx-1 ${styles.verseInline}`}>
                            {v.text_uthmani}
                        </span>
                    ))}
                </div>
            </div>

            {/* كارت لكل آية */}
            {verses.map((v) => (
                <div key={v.id} className={`card shadow-sm mb-3 p-3 ${styles.verseCard}`}>
                    <h5 className="text-end mb-3">
                        {v.chapter_id} — آية {v.verse_number}
                    </h5>

                    <p className={`fs-4 text-end ${styles.verseText}`}>{v.text_uthmani}</p>

                    {v.audio_url && (
                        <audio controls className="w-100 my-2">
                            <source src={v.audio_url} type="audio/mpeg" />
                            متصفحك لا يدعم الصوت
                        </audio>
                    )}

                    {/* عرض 3 تفاسير لكل آية */}
                    {v.tafsirs.map((t, idx) => (
                        <div key={idx} className={`mt-2 p-2 rounded ${styles.tafsirBox}`}>
                            <strong>{["ابن كثير", "السعدي", "الطبري"][idx]}:</strong> {t}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
