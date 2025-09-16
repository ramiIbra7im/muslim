import GodNames from "./Quran";

export async function generateMetadata() {
    return {
        title: "القران الكريم- نسك المسلم",
        description: "صفحة تعرض أسماء الله الحسنى مع معانيها لتسهيل حفظها والتأمل فيها.",
    };
}

export default function Page() {
    return <GodNames />;
}
