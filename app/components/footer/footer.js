"use client";

import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.css";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className="row text-center text-md-start">

                    {/* العمود الأول */}
                    <div className="col-md-4 mb-4 text-end">
                        <h5 className={styles.title}>عن الموقع</h5>
                        <p className={styles.text}>
                            هذا الموقع يهدف إلى توفير محتوى إسلامي نافع (أذكار، أحاديث، مواقيت صلاة)
                            مع تصميم بسيط وسهل الاستخدام.
                        </p>
                    </div>

                    {/* العمود الثاني (اللوجو) */}
                    <div className="col-md-4 mb-4 d-flex justify-content-center align-items-center">
                        <Image
                            src="/logo1.svg"
                            alt="شعار الموقع"
                            width={400}
                            height={80}
                            className={styles.logo}
                            priority
                        />
                    </div>

                    {/* العمود الثالث (التواصل) */}
                    <div className="col-md-4 mb-4 text-center">
                        <h5 className={styles.title}>تواصل معنا</h5>
                        <div className={`${styles.social} d-flex justify-content-center gap-3`}>
                            <a href="https://www.facebook.com/RaMI.IbRa7iM"><FaFacebook /></a>
                            <a href="#"><FaLinkedin /></a>
                            <a href="https://wa.me/201551212431"><FaWhatsapp /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copy}>
                © {new Date().getFullYear()} جميع الحقوق محفوظة - للمصمم <strong>Ramy Ibrahim</strong>
            </div>
        </footer>
    );
}
