import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const page = params.page;

    try {
        // جلب النصوص
        const resVerses = await fetch(
            `https://apis-prelive.quran.foundation/content/api/v4/quran/verses/by_page/${page}`,
            {
                headers: {
                    "x-auth-token": process.env.QURAN_AUTH_TOKEN,
                    "x-client-id": process.env.QURAN_CLIENT_ID,
                },
            }
        );
        const dataVerses = await resVerses.json();

        // جلب الصوت (الحصري example)
        const resAudio = await fetch(
            `https://apis-prelive.quran.foundation/content/api/v4/recitations/1/by_page/${page}`,
            {
                headers: {
                    "x-auth-token": process.env.QURAN_AUTH_TOKEN,
                    "x-client-id": process.env.QURAN_CLIENT_ID,
                },
            }
        );
        const dataAudio = await resAudio.json();

        // جلب التفاسير الثلاثة لكل آية
        const TAFSIR_IDS = [
            { id: 169, name: "ابن كثير" },
            { id: 163, name: "السعدي" },
            { id: 164, name: "الطبري" },
        ];

        const versesWithExtras = await Promise.all(
            dataVerses.data.verses.map(async (v) => {
                // الصوت
                const audioObj = dataAudio.audio_files.find(
                    (a) => a.verse_key === v.verse_key
                );
                const audio_url = audioObj ? audioObj.audio_url : null;

                // التفاسير
                const tafsirs = await Promise.all(
                    TAFSIR_IDS.map(async (t) => {
                        try {
                            const resTafsir = await fetch(
                                `https://apis-prelive.quran.foundation/content/api/v4/tafsirs/${t.id}/by_ayah/${v.verse_key}`,
                                {
                                    headers: {
                                        "x-auth-token": process.env.QURAN_AUTH_TOKEN,
                                        "x-client-id": process.env.QURAN_CLIENT_ID,
                                    },
                                }
                            );
                            const dataTafsir = await resTafsir.json();
                            return dataTafsir.tafsirs?.[0]?.text || "غير متوفر";
                        } catch {
                            return "غير متوفر";
                        }
                    })
                );

                return {
                    id: v.id,
                    verse_number: v.verse_number,
                    chapter_id: v.chapter_id,
                    text_uthmani: v.text_uthmani,
                    audio_url,
                    tafsirs,
                };
            })
        );

        return NextResponse.json({ verses: versesWithExtras });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "فشل في جلب البيانات" }, { status: 500 });
    }
}
