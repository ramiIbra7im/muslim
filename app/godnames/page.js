import GodNames from "./GodNames";

export async function generateMetadata() {
    return {
        title: "أسماء الله الحسنى - نسك المسلم",
        description: "صفحة تعرض أسماء الله الحسنى مع معانيها لتسهيل حفظها والتأمل فيها.",
    };
}

export default function Page() {
    return <GodNames />;
}
