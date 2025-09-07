"use client";

import { useEffect, useState } from "react";
import styles from "./DailyQuran.module.css";

const API_QURAN = "https://api.quran.com/api/v4";
const API_TAFSIR = "https://apis-prelive.quran.foundation/content/api/v4";
const RECITATION_ID = 1;   // الحصري
const TAFSIR_ID = 168;     // Ma'arif al-Qur'an (Pre-Production)
const PAGE_NUMBER = 2;     // غيّر رقم الصفحة اللي عايزها

export default function QuranPage() {
    const [verses, setVerses] = useState([]);
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // 1️⃣ جلب الآيات بالنص العثماني
                const resVerses = await fetch(
                    `${API_QURAN}/quran/verses/uthmani?page_number=${PAGE_NUMBER}`
                );
                const dataVerses = await resVerses.json();

                // 2️⃣ جلب الصوت لكل آية
                const resAudio = await fetch(
                    `${API_QURAN}/recitations/${RECITATION_ID}/by_page/${PAGE_NUMBER}`
                );
                const dataAudio = await resAudio.json();

                // 3️⃣ أسماء السور
                const resSurahs = await fetch(`${API_QURAN}/chapters`);
                const dataSurahs = await resSurahs.json();

                // 4️⃣ دمج الصوت + جلب التفسير لكل آية
                const versesWithExtras = await Promise.all(
                    dataVerses.verses.map(async (v) => {
                        // الصوت
                        const audioObj = dataAudio.audio_files?.find(
                            (a) => a.verse_key === v.verse_key
                        );
                        const audio_url = audioObj
                            ? `https://verses.quran.com/${audioObj.url}`
                            : null;

                        // التفسير
                        let tafsirHtml = null;
                        try {
                            const resTafsir = await fetch(
                                `${API_TAFSIR}/tafsirs/${TAFSIR_ID}/by_ayah/${v.verse_key}`,
                                { headers: { "x-client-id": "c9c6a648-a41d-42b2-9631-b022cb9651d1" } }
                            );
                            const dataTafsir = await resTafsir.json();
                            tafsirHtml = dataTafsir.tafsir?.text || null;
                        } catch (e) {
                            tafsirHtml = null;
                        }

                        return { ...v, audio_url, tafsirHtml };
                    })
                );

                setVerses(versesWithExtras);
                setSurahs(dataSurahs.chapters || []);
            } catch (e) {
                console.error("خطأ:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p className="text-center mt-5">⏳ جاري التحميل...</p>;

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
            {verses.map((v) => {
                const surah = surahs.find((s) => s.id === v.chapter_id);

                return (
                    <div key={v.id} className={`card shadow-sm mb-3 p-3 ${styles.verseCard}`}>
                        <h5 className="text-end mb-3">
                            {surah ? surah.name_arabic : "سورة"} — آية {v.verse_number}
                        </h5>

                        <p className={`fs-4 text-end ${styles.verseText}`}>{v.text_uthmani}</p>

                        {v.audio_url && (
                            <audio controls className="w-100 my-2">
                                <source src={v.audio_url} type="audio/mpeg" />
                                متصفحك لا يدعم الصوت
                            </audio>
                        )}

                        {v.tafsirHtml && (
                            <div className={`mt-3 p-3 rounded ${styles.tafsirBox}`}>
                                <div
                                    className={styles.tafsirText}
                                    dangerouslySetInnerHTML={{ __html: v.tafsirHtml }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
