"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function AdhkarTabs() {
    const [tab, setTab] = useState("morning");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false); // للتحكم بتأخير ظهور الشاشة
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        setLoading(true);
        setShowLoading(false);

        // تأخير 500ms قبل إظهار شاشة التحميل
        const timeout = setTimeout(() => setShowLoading(true), 500);

        const url =
            tab === "morning"
                ? "https://ahegazy.github.io/muslimKit/json/azkar_sabah.json"
                : "https://ahegazy.github.io/muslimKit/json/azkar_massa.json";

        fetch(url)
            .then((r) => r.json())
            .then((data) => {
                const arr = Array.isArray(data?.content) ? data.content : [];
                setItems(arr);

                const initialCounts = {};
                arr.forEach((z, i) => {
                    const n = parseInt(z?.repeat ?? z?.count ?? "1", 10);
                    initialCounts[i] = Number.isNaN(n) || n <= 0 ? 1 : n;
                });
                setCounts(initialCounts);
                setLoading(false);
            })
            .catch(() => {
                setItems([]);
                setCounts({});
                setLoading(false);
            });

        return () => clearTimeout(timeout);
    }, [tab]);

    const copyToClipboard = async (text, idx) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 1500);
            toast.success("تم نسخ الذكر!");
        } catch {
            toast.error("تعذّر النسخ");
        }
    };

    const decrementCount = (idx) => {
        setCounts((prev) => {
            const newCounts = { ...prev };
            if (newCounts[idx] > 0) {
                newCounts[idx] -= 1;
                if (newCounts[idx] === 0) toast.success("أحسنت! أنهيت هذا الذكر.");
            }
            return newCounts;
        });
    };

    if (loading && showLoading)
        return (
            <LoadingScreen
                show={loading && showLoading}
                color="#18a999"
                message="جاري التحضير..."
                dhikr={["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر", "لا حول ولا قوة إلا بالله"]}
                intervalMs={2000} // التأخير بين الأذكار
                dim={0.85}        // خلفية داكنة "سمّري"
            />
        );

    return (
        <div className="container py-3" dir="rtl">
            <Toaster position="bottom-center" />
            <h5 className="text-center mb-4 fw-bold">الأذكار</h5>

            {/* التبويبات */}
            <div className="btn-group mb-4 d-flex justify-content-center">
                <button className={`btn btn-${tab === "morning" ? "primary" : "outline-primary"}`} onClick={() => setTab("morning")}>
                    الصباح
                </button>
                <button className={`btn btn-${tab === "evening" ? "primary" : "outline-primary"}`} onClick={() => setTab("evening")}>
                    المساء
                </button>
            </div>

            <div className="d-flex flex-column align-items-center">
                {items.map((z, idx) => {
                    const text = z?.zekr ?? z?.text ?? "";
                    const repeatTxt = z?.repeat ?? z?.count ?? 1;
                    const current = counts[idx] ?? 1;

                    return (
                        <div key={idx} className="card shadow-sm mb-4 rounded w-100" style={{ maxWidth: "650px" }}>
                            <div className="card-body">
                                <h4 className="card-text lh-lg fw-bold">{text}</h4>

                                <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-3">
                                    {/* زر النسخ */}
                                    <button className="btn btn-outline-primary btn-sm px-4" onClick={() => copyToClipboard(text, idx)}>
                                        نسخ
                                    </button>

                                    {/* عداد + زر تم */}
                                    <button className="btn btn-success btn-sm d-flex align-items-center gap-2 px-4 py-1" onClick={() => decrementCount(idx)} disabled={current === 0}>
                                        <span>التكرار: {current}</span>
                                    </button>
                                </div>

                                {z?.bless && <div className=" mt-3 small text-secondary fw-bolder"> {z.bless}</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
