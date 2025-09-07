"use client";
import styles from "./HeroSection.module.css";

export default function HeroSection({ title, subtitle, height = "200px" }) {
    return (
        <div className={`${styles.heroWrapper} shadow`} style={{ height }}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{title}</h1>
                {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
            </div>
        </div>
    );
}
