import Link from "next/link";
import HeroSection from "../components/HeroSection";
import styles from "./AzkarPage.module.css";

export const metadata = {
    title: "الأذكار - نسك المسلم",
    description: "صفحة الأذكار لموقع نسك المسلم، زاد الروح وطمأنينة القلب.",
};

// استخدام fetch على السيرفر
export default async function AzkarHomeServer() {
    let azkarList = [];
    try {
        const res = await fetch(
            "https://raw.githubusercontent.com/wdalgrb/azkar-api/main/azkar.json",
            { next: { revalidate: 3600 } } // يعيد الجلب كل ساعة
        );
        const data = await res.json();
        const categories = Object.keys(data);
        azkarList = categories.map((c) => ({
            href: `/adhkar/${encodeURIComponent(c)}`,
            label: c,
        }));
    } catch (e) {
        azkarList = [];
    }

    return (
        <div>
            <HeroSection title="الأذكار" subtitle="زاد الروح وطمأنينة القلب" />
            <div className={`${styles['azkar-main']} container-fluid p-4 min-vh-100`}>
                <div className="row g-4">
                    {azkarList.map((item, index) => (
                        <div key={index} className="col-lg-4 col-md-4 col-sm-6">
                            <Link href={item.href} className="text-decoration-none">
                                <div className={`text-center shadow-sm border h-100 ${styles.cardCustom}`}>
                                    <p className={`mb-0 ${styles.customGreen}`}>{item.label}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
