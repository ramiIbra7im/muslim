"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeftCircle } from "lucide-react";
import HeroSection from "../components/HeroSection";
import styles from "./HadithBooksPage.module.css";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

export default function HadithBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        fetch("https://api.hadith.gading.dev/books")
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) {
                    setBooks(Object.values(data.data));
                } else {
                    setError("تعذّر تحميل قائمة الكتب");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("تعذّر تحميل قائمة الكتب");
                setLoading(false);
            });
    }, []);
    if (loading)
        return (
            <LoadingScreen
                show={loading}
                color="#18a999"
                message="جاري التحميل..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "لا حول ولا قوة إلا بالله"]}
                intervalMs={1000}
                dim={1}
            />
        );
    return (
        <div>
            <HeroSection
                title="قائمة كتب الحديث"
            />
            <div className={`container-fluid p-4  ${styles.container}`} dir="rtl">

                {error && <div className={styles.error}>{error}</div>}

                {!loading && !error && (
                    <div className="row g-4">
                        {books.map((book) => (
                            <div className="col-lg-4 col-md-6" key={book.id}>
                                <div className={`card shadow-sm border  p-4 text-center ${styles.bookCard}`}>
                                    <BookOpen size={40} className={`${styles.customGreen} mb-3`} />
                                    <h4 className={`mb-2 fw-bold ${styles.customGreen}`}>
                                        {bookNames[book.id] || book.id}
                                    </h4>
                                    <p className="mb-4 text-muted small">
                                        عدد الأحاديث:{" "}
                                        <span className="fw-semibold">{book.available}</span>
                                    </p>
                                    <Link
                                        href={`/hadith-books/${book.id}`}
                                        className={`btn ${styles.customGreenBtn} w-100 fw-semibold d-flex justify-content-center align-items-center gap-2`}
                                    >
                                        <ArrowLeftCircle size={18} />
                                        عرض الأحاديث
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
