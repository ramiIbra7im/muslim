"use client";
import { useEffect, useState } from "react";
import { BookOpen, Share2 } from "lucide-react";
import HeroSection from "../components/HeroSection";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import styles from "./HadithBooksPage.module.css";
import { toast } from "react-toastify";

export default function HadithBook({ slug }) {
    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const bookNames = {
        bukhari: "صحيح البخاري",
        muslim: "صحيح مسلم",
        nasai: "سنن النسائي",
        tirmidzi: "سنن الترمذي",
        "abu-daud": "سنن أبي داود",
        "ibnu-majah": "سنن ابن ماجه",
        ahmad: "مسند أحمد",
        malik: "موطأ مالك",
        darimi: "سنن الدارمي"
    };

    useEffect(() => {
        if (!slug) return;
        fetch(`https://api.hadith.gading.dev/books/${slug}?range=1-300`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.data?.hadiths) {
                    setHadiths(data.data.hadiths);
                } else {
                    setError("تعذّر تحميل الأحاديث");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("تعذّر تحميل الأحاديث");
                setLoading(false);
            });
    }, [slug]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = hadiths.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(hadiths.length / itemsPerPage);

    const goToPage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("تم نسخ الحديث!");
        } catch {
            toast.error("تعذّر النسخ");
        }
    };

    const shareHadith = (text) => {
        if (navigator.share) {
            navigator.share({
                text,
            });
        } else {
            alert("خاصية المشاركة غير مدعومة في هذا المتصفح");
        }
    };

    if (loading)
        return (
            <LoadingScreen
                show={loading}
                color="#18a999"
                message="جاري تحميل الأحاديث..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "لا حول ولا قوة إلا بالله"]}
                intervalMs={1000}
                dim={1}
            />
        );

    return (
        <div>
            <HeroSection title={`أحاديث ${bookNames[slug] || slug}`} />

            <div className={`container-fluid py-4 ${styles.container}`} dir="rtl">
                {error && <div className={styles.error}>{error}</div>}

                {!loading && !error && (
                    <>
                        <div className="d-flex flex-column col-10 m-auto gap-3">
                            {currentItems.map((h) => (
                                <div
                                    key={h.number}
                                    className={`card p-4 shadow-sm ${styles.hadithCard} ${styles.customGreenBorder}`}
                                >
                                    <h5 className={`mb-3 d-flex align-items-center gap-2 fw-bold ${styles.customGreen}`}>
                                        <BookOpen size={20} /> حديث رقم {h.number}
                                    </h5>
                                    <p className={`${styles.content} lh-lg fs-3 text-dark`}>{h.arab}</p>

                                    {/* أزرار النسخ والمشاركة */}
                                    <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap mt-3">
                                        <button
                                            className={`btn btn-outline-success btn-sm px-3 fw-bold rounded-pill shadow-sm p-1 ${styles.copyBtn}`}
                                            onClick={() => copyToClipboard(h.arab)}
                                        >
                                            نسخ
                                        </button>
                                        <button
                                            className={`btn btn-outline-primary btn-sm px-3 fw-bold rounded-pill shadow-sm ${styles.shareBtn}`}
                                            onClick={() => shareHadith(h.arab)}
                                        >
                                            مشاركة <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                            <button
                                className={`btn ${styles.customGreenOutlineBtn}`}
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                السابق
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`btn ${currentPage === idx + 1 ? styles.customGreenBtn : styles.customGreenOutlineBtn}`}
                                    onClick={() => goToPage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button
                                className={`btn ${styles.customGreenOutlineBtn}`}
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                التالي
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
