import TasbeehCounter from "./TasbeehCounter";

export async function generateMetadata() {
    return {
        title: "المسبحة الالكترونيه - نسك المسلم",
        description: "عداد التسبيح لموقع نسك المسلم، لتسهيل تتبع التسبيحات اليومية.",
    };
}

export default function Page() {
    return <TasbeehCounter />;
}
