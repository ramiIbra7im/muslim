"use client";
import Image from "next/image";

export default function QuranCover() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 ">
            <Image
                src="/quran.png"
                alt="غلاف القرآن الكريم"
                width={400}   // العرض اللي تحبه
                height={400}  // الارتفاع اللي تحبه
                priority
            />
        </div>
    );
}
