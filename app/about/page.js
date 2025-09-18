"use client";

import React, { useEffect, useState } from "react";
import styles from "./ProjectDetails.module.css";
import { BiCode } from "react-icons/bi"; // أي أيقونة ثابتة للـ API

const islamicProject = {
    title: "نسك المسلم",
    type: "موقع اسلامي ",
    // description:
    //     " يعرض محتوى ديني: أذكار، قرآن، تفسير، أسم الله الحسنى، أحاديث، ومواقيت الصلاة.",
    tools: ["Next.js", "React", "Bootstrap"],
    apis: [
        { name: "Azkar JSON", purpose: "جلب الأذكار", link: "https://raw.githubusercontent.com/wdalgrb/azkar-api/main/azkar.json" },
        { name: "Names of Allah", purpose: "جلب أسماء الله الحسنى", link: "https://raw.githubusercontent.com/rn0x/Names_Of_Allah_Json/main/Names_Of_Allah.json" },
        { name: "Hadith Books", purpose: "جلب قائمة الكتب المتاحة", link: "https://api.hadith.gading.dev/books" },
        { name: "Hadith Book Example", purpose: "جلب الأحاديث من كتاب محدد", link: "https://api.hadith.gading.dev/books/bukhari?range=1-300" },
        { name: "Hijri to Gregorian Calendar", purpose: "تحويل تاريخ هجري إلى ميلادي", link: "https://api.aladhan.com/v1/hToGCalendar/1/2025" },
        { name: "Gregorian to Hijri", purpose: "تحويل تاريخ ميلادي إلى هجري", link: "https://api.aladhan.com/v1/gToH?date=17-9-2025" },
        { name: "Adhkar JSON", purpose: "جلب أذكار إضافية", link: "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json" },
        { name: "Prayer Timings By Coordinates", purpose: "حساب مواقيت الصلاة حسب الإحداثيات", link: "https://api.aladhan.com/v1/timings/2025-09-17?latitude=30.0444&longitude=31.2357&method=5&school=0" },
        { name: "Prayer Timings By City", purpose: "حساب مواقيت الصلاة حسب المدينة", link: "https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5&school=0" },
        { name: "Surah List", purpose: "جلب قائمة السور", link: "https://api.alquran.cloud/v1/surah" },
        { name: "Surah Uthmani", purpose: "جلب نص السورة برواية عثمانية", link: "https://api.alquran.cloud/v1/surah/1/editions/quran-uthmani" },
    ],
};
islamicProject.tools = [
    "Next.js",           // إطار العمل الأساسي للواجهة
    "Bootstrap 5",       // لتنسيق العناصر والاستجابة
    "CSS Modules",       // لتنسيق مخصص للكروت والألوان
    "React Icons",       // لأيقونات الكروت
    "Axios / Fetch API", // لجلب البيانات من API
    "Next/Head SEO",     // لتحسين SEO ودعم وسائل التواصل
    "Framer Motion",     // للأنيميشن في بعض الكروت أو العناصر
];

const IslamicProjectAPITable = () => {
    const [apiStatus, setApiStatus] = useState({});

    useEffect(() => {
        islamicProject.apis.forEach(async (api) => {
            try {
                const response = await fetch(api.link, { method: "HEAD" });
                setApiStatus((prev) => ({ ...prev, [api.name]: response.ok ? "Active" : "Not Active" }));
            } catch {
                setApiStatus((prev) => ({ ...prev, [api.name]: "Error" }));
            }
        });
    }, []);

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold ">{islamicProject.title}</h1>
                <h4 className="text-muted mb-3">{islamicProject.type}</h4>
                <p className="lead">{islamicProject.description}</p>
            </div>
            <div className="mb-5">
                <h2 className="mb-3 text-center fw-bolder">التقنيات المستخدم</h2>
                <ul className={styles.toolList}>
                    {islamicProject.tools.map((tool, i) => (
                        <li className={styles.toolItem} key={i}>
                            {tool}
                        </li>
                    ))}
                </ul>
            </div>


            <h2 className="mb-3 text-center fw-bolder ">APIs المستخدمة</h2>

            <div className="row g-4">
                {islamicProject.apis.map((api, i) => (
                    <div className="col-md-6 col-lg-4" key={i}>
                        <div className={`card ${styles.cardHover}`}>

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className={styles.avatar}>
                                    <BiCode size={20} /> {/* أيقونة ثابتة */}
                                </div>
                                <i className="bi bi-three-dots-vertical"></i>
                            </div>

                            {/* Body */}
                            <p className={styles.cardSubtitle}>{api.purpose}</p>
                            <div className="mb-3">
                                <h6 className={styles.cardTitle}>{api.name}</h6>
                            </div>

                            {/* Footer */}
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className={`btn rounded-4 ${apiStatus[api.name] === "Active"
                                    ? "btn-success"
                                    : apiStatus[api.name] === "Error" || apiStatus[api.name] === "Not Active"
                                        ? "btn-danger"
                                        : "btn-warning"} btn-sm text-white`}>
                                    {apiStatus[api.name] || "Checking"}
                                </span>
                                <a href={api.link} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                                    عرض الرابط
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



            <div className="text-center mt-5">
                <a href="https://muslim-rb.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg px-5">
                    زيارة الموقع
                </a>
            </div>
        </div>
    );
};

export default IslamicProjectAPITable;