"use client";
import { useEffect, useRef } from "react";

export default function AutoScrollControl({ containerRef, scrollSpeed, setScrollSpeed }) {
    const rafId = useRef(null);
    const lastScrollTime = useRef(performance.now());

    useEffect(() => {
        if (!containerRef.current) return;

        // أزمنة التأخير لكل مستوى سرعة
        const SPEED_DELAY = [0, 200, 120, 80, 60, 40];
        // المستوى 1 = كل 200ms (بطيء وواضح)
        // المستوى 5 = كل 40ms (أسرع)

        const step = (now) => {
            if (!containerRef.current) return;

            const delay = SPEED_DELAY[scrollSpeed] || 0;

            if (delay > 0 && now - lastScrollTime.current >= delay) {
                containerRef.current.scrollTop += 1; // تحريك بسيط جدًا (1px)
                lastScrollTime.current = now;
            }

            rafId.current = requestAnimationFrame(step);
        };

        rafId.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId.current);
    }, [scrollSpeed, containerRef]);

    return (
        <div className="d-flex align-items-center gap-2">
            <label className="form-label m-0" style={{ whiteSpace: "nowrap" }}>
                سرعة:
            </label>
            <input
                type="range"
                className="form-range"
                min={0}
                max={5}
                step={1}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                style={{ width: "150px" }}
            />
            <span style={{ minWidth: "40px", textAlign: "center" }}>
                {scrollSpeed}
            </span>
        </div>
    );
}
