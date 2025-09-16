import GodNames from "./hadith";

export async function generateMetadata() {
    return {
        title: "الاحاديث - نسك المسلم",
        description: "صفحة تعرض أسماء الله الحسنى مع معانيها لتسهيل حفظها والتأمل فيها.",
    };
}

export default function Page() {
    return <GodNames />;
}
