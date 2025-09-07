"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPray, FaBookOpen, FaMosque, FaBars } from "react-icons/fa";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { href: "/prayers", icon: <FaPray />, label: "مواقيت الصلاة", key: "prayers" },
        { href: "/adhkar", icon: <FaBookOpen />, label: "الأذكار و الأدعية", key: "adhkar" },
        { href: "/tasbeeh", icon: <FaMosque />, label: "المسبحة", key: "tasbeeh" },
        { href: "/godnames", icon: <FaMosque />, label: "اسماء الله الحسني", key: "godnames" },
        { href: "/Quran", icon: <FaMosque />, label: "القران الكريم", key: "Quran" },
        { href: "/hadith-books", icon: <FaMosque />, label: "احاديث", key: "hadith-books" },
        { href: "/hijricalendar", icon: <FaMosque />, label: "التقويم الهجري", key: "hijricalendar" },
        { href: "/zakat", icon: <FaMosque />, label: "حساب الذكاة ", key: "zakat" },
        { href: "/DailyReminder", icon: <FaMosque />, label: "الورد اليومي", key: "DailyReminder" },
    ];

    return (
        <>
            {/* زر الموبايل */}
            <button
                className={`btn btn-primary d-md-none ${styles.mobileToggle}`}
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                <FaBars />
            </button>

            {/* Sidebar */}
            <nav className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
                <h4 className={styles.title}>القائمة</h4>
                <ul className="nav flex-column w-100 px-2">
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
