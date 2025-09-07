export default function AyahMark({ number }) {
    return (
        <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#fff8e1" stroke="#b71c1c" strokeWidth="5" />
            <circle cx="50" cy="50" r="35" fill="#b71c1c" />
            <text
                x="50"
                y="58"
                textAnchor="middle"
                fontSize="40"
                fontFamily="Amiri"
                fill="#fff">
                {number}
            </text>
        </svg>
    );
}
