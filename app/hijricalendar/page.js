"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./HijriCalendar.module.css";
import { GiSheep } from "react-icons/gi";
import { FaArrowLeft, FaArrowRight, FaMoon, FaStar, FaKaaba, FaMosque } from "react-icons/fa";

const hijriMonths = [
    "محرم", "صفر", "ربيع الأول", "ربيع الآخر",
    "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

const hijriDays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const allowedEvents = ["Eid", "Ramadan", "Hajj", "Mawlid"];

const translateEvent = (eventName) => {
    if (!eventName) return "";
    const translations = {
        "Mawlid": "المولد النبوي ",
        "Ramadan": "بداية رمضان",
        "Eid-ul-Fitr": "عيد الفطر ",
        "Eid-ul-Adha": "عيد الأضحى ",
        "Hajj": "موسم الحج"
    };

    for (const [key, value] of Object.entries(translations)) {
        if (eventName.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }
    return eventName;
};

// تحويل "DD-MM-YYYY" إلى Date (آمن)
const parseDDMMYYYY = (str) => {
    const [dd, mm, yyyy] = (str || "").split("-").map(Number);
    return new Date(yyyy, (mm || 1) - 1, dd || 1, 0, 0, 0);
};

export default function HijriCalendar() {
    const todayGregorian = new Date();
    const [hijriDate, setHijriDate] = useState(null);
    const [calendarDays, setCalendarDays] = useState([]);
    const [currentHijriMonth, setCurrentHijriMonth] = useState(null);
    const [currentHijriYear, setCurrentHijriYear] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [todayEvent, setTodayEvent] = useState(null); // مناسبة اليوم (ستات منفصلة)
    const [nextEvent, setNextEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    // ✅ ستات منفصلة للعداد — يخص عرض داخل بانر "المناسبة الحالية" (أيام حتى المناسبة القادمة)
    const [daysUntilNextEvent, setDaysUntilNextEvent] = useState(null);

    const fetchMonthData = async (month, year, todayInfo = null) => {
        try {
            const res = await axios.get(
                `https://api.aladhan.com/v1/hToGCalendar/${month}/${year}`
            );
            const rawDays = res.data.data || [];

            const monthEvents = rawDays.filter(
                (ev) =>
                    ev.hijri.holidays &&
                    ev.hijri.holidays.some((h) =>
                        allowedEvents.some((keyword) =>
                            new RegExp(keyword, "i").test(h)
                        )
                    )
            );

            if (todayInfo) {
                const daysArray = [];
                for (let i = 1; i <= 30; i++) {
                    const event = monthEvents.find((ev) => parseInt(ev.hijri.day) === i);
                    daysArray.push({
                        day: i,
                        month,
                        hasEvent: !!event,
                        eventName: event ? translateEvent(event.hijri.holidays[0]) : null,
                    });

                    // ✅ ضع todayEvent فقط عندما نجلب بيانات الشهر الخاص باليوم الحالي
                    if (i === todayInfo.day && event && todayInfo.month === month) {
                        setTodayEvent(translateEvent(event.hijri.holidays[0]));
                    }
                }
                setCalendarDays(daysArray);
            }

            return monthEvents;
        } catch (error) {
            console.error("فشل في جلب البيانات:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchHijriToday = async () => {
            try {
                const res = await axios.get(
                    `https://api.aladhan.com/v1/gToH?date=${todayGregorian.getDate()}-${todayGregorian.getMonth() + 1}-${todayGregorian.getFullYear()}`
                );
                const hijri = res.data.data.hijri;

                const day = parseInt(hijri.day);
                const month = parseInt(hijri.month.number);
                const year = parseInt(hijri.year);

                setHijriDate({ day, month, year });
                setCurrentHijriMonth(month);
                setCurrentHijriYear(year);

                const eventsArr = [];
                for (let m = 1; m <= 12; m++) {
                    const ev = await fetchMonthData(m, year, m === month ? { day, month } : null);
                    eventsArr.push(...ev);
                }
                setAllEvents(eventsArr);

                // المناسبة القادمة داخل نفس السنة الهجرية الحالية
                const upcoming = eventsArr.find(
                    (ev) =>
                        parseInt(ev.hijri.year) === year &&
                        (parseInt(ev.hijri.month.number) > month ||
                            (parseInt(ev.hijri.month.number) === month && parseInt(ev.hijri.day) > day))
                );
                if (upcoming) {
                    setNextEvent({
                        name: translateEvent(upcoming.hijri.holidays[0]),
                        day: upcoming.hijri.day,
                        month: upcoming.hijri.month.number,
                        year: upcoming.hijri.year,
                        gregorian: upcoming.gregorian?.date || null, // "DD-MM-YYYY" إن وُجد
                    });
                }

            } catch (error) {
                console.error("فشل في جلب التاريخ الهجري:", error);
            }
        };

        fetchHijriToday();
    }, []);

    // ✅ حساب أيام المتبقية للمناسبة القادمة (ستات منفصلة، لا تتأثر باختيار المستخدم)
    useEffect(() => {
        if (!nextEvent) {
            setDaysUntilNextEvent(null);
            return;
        }

        const computeTarget = () => {
            let targetDate;
            if (nextEvent.gregorian) {
                // API عادة يعطي الشكل "DD-MM-YYYY"
                targetDate = parseDDMMYYYY(nextEvent.gregorian);
            } else {
                // احتياطياً: نبني تاريخ تقريبي بالاعتماد على السنة الحالية (إذا فات، نستعمل السنة التالية)
                const now = new Date();
                targetDate = new Date(now.getFullYear(), (nextEvent.month || 1) - 1, nextEvent.day || 1);
                if (targetDate < now) targetDate.setFullYear(now.getFullYear() + 1);
            }

            const msPerDay = 24 * 60 * 60 * 1000;
            const diff = Math.ceil((targetDate - new Date()) / msPerDay);
            setDaysUntilNextEvent(diff > 0 ? diff : 0);
        };

        computeTarget();
        const id = setInterval(computeTarget, 60 * 60 * 1000); // تحديث كل ساعة كافٍ لليوميات
        return () => clearInterval(id);
    }, [nextEvent]);

    const handlePrevMonth = () => {
        let newMonth = currentHijriMonth - 1;
        let newYear = currentHijriYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        setCurrentHijriMonth(newMonth);
        setCurrentHijriYear(newYear);
        fetchMonthData(newMonth, newYear, hijriDate);
    };

    const handleNextMonth = () => {
        let newMonth = currentHijriMonth + 1;
        let newYear = currentHijriYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        }
        setCurrentHijriMonth(newMonth);
        setCurrentHijriYear(newYear);
        fetchMonthData(newMonth, newYear, hijriDate);
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(event);

        const eventMonth = parseInt(event.hijri.month.number);
        const eventYear = parseInt(event.hijri.year);

        setCurrentHijriMonth(eventMonth);
        setCurrentHijriYear(eventYear);

        // نرسل hijriDate كـ todayInfo كما في كودك الأصلي — لكن fetchMonthData لن يغير todayEvent
        // لأن أضفت شرط التأكد أن اليوم يضبط فقط للميل المناسب (todayInfo.month === month)
        fetchMonthData(eventMonth, eventYear, hijriDate);
    };

    const handleDaySelect = (dayObj) => {
        setSelectedDay(dayObj);
    };

    return (
        <div className={`${styles.container} container-fluid py-3 min-vh-100 `}>
            <div className="row g-4">
                {/* العمود الأيسر */}
                <div className="col-12 col-lg-5 d-flex flex-column h-100">
                    {/* كارت التاريخ */}
                    <div className="card shadow-sm border rounded-4 p-4 text-center mb-4 flex-fill">
                        {hijriDate && (
                            <>
                                <h2 className={`${styles.titmonth} fw-bold `}>
                                    {hijriDate.day} {hijriMonths[hijriDate.month - 1]}
                                </h2>
                                <p className="mb-1 fs-5 text-secondary">{hijriDate.year} هـ</p>
                            </>
                        )}
                        <p className="small text-muted">{todayGregorian.toLocaleDateString()}</p>

                        {nextEvent && (
                            <div className={`${styles.nextEventCard} d-flex justify-content-between align-items-center p-3 mt-3 rounded-4 shadow-sm`}>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={styles.nextEventIcon}></span>
                                    <div className={styles.nextEventLabel}>المناسبة القادمة:</div>
                                    <div>
                                        <div className={styles.nextEventName}>{nextEvent.name}</div>
                                    </div>
                                </div>
                                <div className={`${styles.nextEventDate} p-2 rounded-5`}>
                                    ({nextEvent.day}/{nextEvent.month})
                                </div>
                            </div>
                        )}

                    </div>

                    {/* كارت المناسبات الإسلامية */}
                    {allEvents.length > 0 && (
                        <div className={`${styles.mnasbat} card shadow-sm border rounded-4 p-3 `}>
                            <h5 className={`${styles.mnasbattit} fw-bold mb-3 `}> المناسبات الإسلامية</h5>
                            <div className="row g-3">
                                {allEvents.map((event, idx) => {
                                    const translated = translateEvent(event.hijri.holidays[0]);
                                    const dateText = `${event.hijri.day}/${event.hijri.month.number}`;

                                    let Icon = FaStar;
                                    if (translated.includes("رمضان")) Icon = FaMoon;
                                    else if (translated.includes("الفطر")) Icon = FaStar;
                                    else if (translated.includes("الأضحى")) Icon = GiSheep;
                                    else if (translated.includes("الحج")) Icon = FaKaaba;
                                    else if (translated.includes("المولد")) Icon = FaMosque;

                                    return (
                                        <div key={idx} className="col-6 col-md-4">
                                            <button
                                                className={`${styles.eventButton} w-100 ${selectedEvent === event ? styles.activeEvent : ""}`}
                                                onClick={() => handleEventSelect(event)}
                                            >
                                                <div className="d-flex align-items-center justify-content-between flex-wrap p-1">
                                                    <span className={styles.eventName}>{translated}</span>
                                                    <div className={styles.eventDate}>{dateText}</div>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* العمود الأيمن: التقويم */}
                <div className="col-12 col-lg-7 d-flex flex-column">
                    <div className="card shadow-sm border rounded-4 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <button className="btn  d-flex align-items-center gap-1" onClick={handlePrevMonth}>
                                <FaArrowLeft />
                            </button>

                            <h4 className="fw-bold text-secondary m-0 text-center flex-grow-1">
                                {hijriDate ? hijriMonths[currentHijriMonth - 1] : ""} {currentHijriYear}
                            </h4>

                            <button className="btn  d-flex align-items-center gap-1" onClick={handleNextMonth}>
                                <FaArrowRight />
                            </button>
                        </div>

                        {/* عناوين الأيام */}
                        <div
                            className="d-grid text-center  fw-bold border-bottom pb-3 mb-3 text-muted"
                            style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
                        >
                            {hijriDays.map((day, idx) => (
                                <div key={idx}>{day}</div>
                            ))}
                        </div>

                        {/* أيام الشهر */}
                        <div
                            className="d-grid"
                            style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}
                        >
                            {calendarDays.map((d, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 p-md-3 rounded-3 shadow-sm text-center
            ${hijriDate && d.day === hijriDate.day && currentHijriMonth === hijriDate.month ? styles.today : ""}
            ${d.hasEvent ? styles.eventDay : "bg-white"}
            ${selectedDay && selectedDay.day === d.day && selectedDay.month === d.month ? styles.selectedDay : ""}
        `}
                                    style={{
                                        minHeight: "60px",
                                        cursor: "pointer",
                                        fontWeight: d.hasEvent ? "600" : "400",
                                        color: d.hasEvent ? "#0d6efd" : "#333",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.9rem",
                                    }}
                                    title={d.eventName || ""}
                                    onClick={() => handleDaySelect(d)}
                                >
                                    {d.day}
                                </div>
                            ))}

                        </div>
                    </div>

                </div>

                {/* البانر الخاص بالمناسبة الحالية (بدون تغيير التصميم) + عرض أيام المتبقية للمناسبة القادمة */}
                <div
                    className={`${styles.islamicBanner} p-4 col p-md-5 container align-items-center justify-content-center mt-3 rounded-4 shadow-sm`}
                >
                    <div className="text-center">

                        {todayEvent ? (
                            <>
                                <p
                                    className={`${styles.islamicSubtitle} text-white fw-semibold mb-2`}
                                    style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                                >
                                    {todayEvent}
                                </p>
                            </>
                        ) : (
                            <p
                                className={`${styles.islamicSubtitle} text-white fw-semibold mb-2`}
                                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                            >
                                {/* لا توجد مناسبة اليوم */}
                            </p>
                        )}

                        {/* عد تنازلي للمناسبة القادمة */}
                        {daysUntilNextEvent !== null && nextEvent && (
                            <p
                                className="fw-bold text-white mt-3"
                                style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
                            >
                                باقي {daysUntilNextEvent} يوم على {nextEvent.name}
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
