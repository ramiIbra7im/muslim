"use client";
import { useState, useEffect } from "react";
import { FaSun, FaPray, FaBed, FaPlane } from "react-icons/fa";

export default function useAzkarList() {
    const [azkarList, setAzkarList] = useState([]);

    useEffect(() => {
        const jsonUrl = "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json";

        fetch(jsonUrl)
            .then((r) => r.json())
            .then((data) => {
                const categories = Array.from(new Set(data.map((d) => d.category)));

                const iconMap = {
                    "أذكار الصباح والمساء": <FaSun />,
                    "أذكار بعد الصلاة": <FaPray />,
                    "أذكار الاستيقاظ": <FaSun />,
                    "أذكار النوم": <FaBed />,
                    "أذكار السفر": <FaPlane />,
                };

                const list = categories.map((c) => ({
                    href: `/adhkar/${encodeURIComponent(c)}`, // فك التشفير عند الاستخدام
                    label: c,
                    icon: iconMap[c] || <FaPray />,
                }));

                setAzkarList(list);
            })
            .catch(() => setAzkarList([]));
    }, []);

    return { azkarList };
}
