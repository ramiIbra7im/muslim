"use client";
import { useEffect, useState } from "react";
import Countdown from "../components/PrayerTimes/Countdown";
import LocationSearch from "../components/PrayerTimes/LocationSearch";
import styles from "./PrayerTimes.module.css";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import Notification from '../components/Notifications/Notifications'
import { FaCity, FaClock, FaCalendarAlt, FaMoon, FaCloudMoon, FaSun, FaCloudSun } from "react-icons/fa";

export default function PrayerTimes() {
    const [times, setTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [countdown, setCountdown] = useState("");
    const [loading, setLoading] = useState(true);
    const [dateInfo, setDateInfo] = useState({});
    const [currentLocation, setCurrentLocation] = useState({ city: "", country: "" });
    const [localTime, setLocalTime] = useState("");
    const [timeZone, setTimeZone] = useState("");

    const translatePrayer = (name) => {
        switch (name) {
            case "Fajr": return "الفجر";
            case "Dhuhr": return "الظهر";
            case "Asr": return "العصر";
            case "Maghrib": return "المغرب";
            case "Isha": return "العشاء";
            default: return name;
        }
    };

    const formatTo12Hour = (timeStr) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = timeZone
                ? new Date().toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone
                })
                : new Date().toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });
            setLocalTime(now);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeZone]);

    const fetchPrayerTimes = async (lat, lng, city = "", country = "") => {
        setLoading(true);
        const start = Date.now();

        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        let url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=5&school=0`;
        if (city) {
            url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5&school=0`;
            setCurrentLocation({ city, country });
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 200) {
            setTimes(data.data.timings);
            setDateInfo(data.data.date);
            setTimeZone(data.data.meta.timezone || "");
        }

        const elapsed = Date.now() - start;
        const minDelay = 1000;
        const remaining = minDelay - elapsed;
        if (remaining > 0) setTimeout(() => setLoading(false), remaining);
        else setLoading(false);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
                    reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                },
                () => {
                    fetchPrayerTimes(30.0444, 31.2357);
                    setCurrentLocation({ city: "القاهرة", country: "مصر" });
                }
            );
        } else {
            fetchPrayerTimes(30.0444, 31.2357);
            setCurrentLocation({ city: "القاهرة", country: "مصر" });
        }
    }, []);

    useEffect(() => {
        if (!times) return;
        const updateCountdown = () => {
            const now = new Date();
            const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            let upcoming = null;

            for (let name of prayerNames) {
                const [h, m] = times[name].split(":").map(Number);
                const prayerTime = new Date();
                prayerTime.setHours(h, m, 0, 0);
                if (prayerTime > now) {
                    upcoming = { name, time: prayerTime };
                    break;
                }
            }
            if (!upcoming) {
                const [h, m] = times["Fajr"].split(":").map(Number);
                const prayerTime = new Date();
                prayerTime.setDate(prayerTime.getDate() + 1);
                prayerTime.setHours(h, m, 0, 0);
                upcoming = { name: "Fajr", time: prayerTime };
            }

            setNextPrayer(translatePrayer(upcoming.name));

            const diff = upcoming.time - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setCountdown(`${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [times]);

    const reverseGeocode = async (lat, lng) => {
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
        );
        const data = await res.json();
        setCurrentLocation({
            city: data.city || data.locality || "غير معروف",
            country: data.countryName || "غير معروف",
        });
    };

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
        <div className={`min-vh-100 ${styles.prayerPage}`} dir="rtl">
            <Notification times={times} />

            {currentLocation.city && (
                <div className="row  m-auto g-3 ">
                    <div className="col-sm-4">
                        <div className={`${styles.locationCard} border shadow-sm rounded text-center py-3 h-100 d-flex flex-column justify-content-center align-items-center`}>

                            <h2 className="mb-0 fw-bold">{currentLocation.city} - {currentLocation.country}</h2>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className={`${styles.locationCard} border shadow-sm rounded text-center h-100 py-3 d-flex flex-column justify-content-center align-items-center`}>

                            {localTime && (
                                <h2 className="mb-0 fw-bold">
                                    الوقت الحالي:<br />
                                    <span>{localTime}</span>
                                </h2>
                            )}
                        </div>
                    </div>

                    {dateInfo && (
                        <div className="col-sm-4 d-flex flex-column gap-3">
                            <div className={`${styles.locationCard} border shadow-sm rounded text-center p-3 d-flex flex-column justify-content-center align-items-center`}>

                                <p className="mb-0 fw-bold">
                                    <strong>الميلادي:</strong> {dateInfo.gregorian?.date}
                                </p>
                            </div>

                            <div className={`${styles.locationCard} border shadow-sm rounded text-center p-3 d-flex flex-column justify-content-center align-items-center`}>

                                <p className="mb-0 fw-bold">
                                    <strong>الهجري:</strong> {dateInfo.hijri?.date}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}


            <div className="mt-2 col-lg-4 m-auto">
                <LocationSearch onSelectCity={(city, country) => fetchPrayerTimes(0, 0, city, country)} />
            </div>

            <Countdown nextPrayer={nextPrayer} countdown={countdown} />



            <div dir="rtl" className="container mt-3">
                <div className="row ">
                    {times &&
                        Object.entries(times)
                            .filter(([key]) => ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(key))
                            .map(([name, time], idx) => {
                                const getIcon = () => {
                                    const iconProps = { size: 28, className: "text-success" };
                                    switch (name) {
                                        case "Fajr":
                                            return <FaCloudMoon {...iconProps} />;
                                        case "Dhuhr":
                                            return <FaSun {...iconProps} />;
                                        case "Asr":
                                            return <FaCloudSun {...iconProps} />;
                                        case "Maghrib":
                                            return <FaCity {...iconProps} />;
                                        case "Isha":
                                            return <FaMoon {...iconProps} />;
                                        default:
                                            return null;
                                    }
                                };

                                return (
                                    <div key={idx} className="col-12 col-sm-6 col-md-4 px-2 mb-4">
                                        <div
                                            className={`${styles.timePrayer} p-3 rounded-4 shadow-sm d-flex flex-column justify-content-between h-100 prayer-card`}
                                        >
                                            {/* الأيقونة فوق اليمين */}
                                            <div className="d-flex justify-content-start">
                                                <div className={styles.iconCircle}>
                                                    {getIcon()}
                                                </div>
                                            </div>


                                            {/* الاسم والوقت تحت بالنص */}
                                            <div className="text-center mt-3">
                                                <h3 className="mb-2 fw-bold">{translatePrayer(name)}</h3>
                                                <span className="fw-bold fs-5">{formatTo12Hour(time)}</span>
                                            </div>
                                        </div>
                                    </div>


                                );
                            })}
                </div>
            </div>
        </div>
    );
}
