"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image"; import {
    FaClock,
    FaBookOpen,
    FaPray,
    FaRegSmileBeam,
    FaQuran,
    FaBook,
    FaCalendarAlt,
    FaCoins,
    FaBars,
    FaInfoCircle,
    FaPersonBooth
} from "react-icons/fa";

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);



    const navItems = [
        { href: "/prayers", icon: <FaClock />, label: "مواقيت الصلاة", key: "prayers" },
        { href: "/adhkar", icon: <FaBookOpen />, label: "الأذكار و الأدعية", key: "adhkar" },
        { href: "/tasbeeh", icon: <FaPray />, label: "المسبحة", key: "tasbeeh" },
        { href: "/godnames", icon: <FaRegSmileBeam />, label: "اسماء الله الحسني", key: "godnames" },
        { href: "/Quran", icon: <FaQuran />, label: "القران الكريم", key: "Quran" },
        { href: "/hadith-books", icon: <FaBook />, label: "احاديث", key: "hadith-books" },
        { href: "/hijricalendar", icon: <FaCalendarAlt />, label: "التقويم الهجري", key: "hijricalendar" },
        { href: "/zakat", icon: <FaCoins />, label: "حساب الزكاة", key: "zakat" },
        { href: "/about", icon: <FaInfoCircle />, label: "عن الموقع", key: "about" },
    ];

    return (
        <>
            {/* زر التوجل للموبايل */}
            <button
                className={`btn  d-md-none ${styles.mobileToggle}`}
                onClick={() => setMobileOpen(true)}
            >
                <FaBars />
            </button>

            {/* الـOverlay للموبايل */}
            {mobileOpen && (
                <div
                    className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 1045 }}
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* الـSidebar */}
            <nav className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""} `}>
                <Image
                    src="/logo1.svg"
                    alt="تسك النسلم"
                    width={200} // عرض الصورة
                    height={65} // ارتفاع الصورة
                    className="px-2"
                />
                <ul className="nav flex-column w-100 px-2 mt-3">
                    {navItems.map((item) => (
                        <li key={item.key} className="nav-item my-1">
                            <Link
                                href={item.href}
                                className={`${styles.navLink} ${pathname === item.href ? styles.activeLink : ""}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.icon} <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

        </>
    );
}
