import styles from "./PrayerTimes.module.css";

export default function PrayerCard({ name, time }) {
    return (
        <div className={`card mb-3 ${styles.prayerCard}`}>
            <div className="card-body text-center">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{time}</p>
            </div>
        </div>
    );
}
