import HadithBook from "../HadithBook";

export async function generateMetadata({ params }) {
    const bookNames = {
        bukhari: "صحيح البخاري",
        muslim: "صحيح مسلم",
        nasai: "سنن النسائي",
        tirmidzi: "سنن الترمذي",
        "abu-daud": "سنن أبي داود",
        "ibnu-majah": "سنن ابن ماجه",
        ahmad: "مسند أحمد",
        malik: "موطأ مالك",
        darimi: "سنن الدارمي"
    };

    const title = `أحاديث ${bookNames[params.slug] || params.slug} - نسك المسلم`;
    const description = `صفحة تعرض أحاديث ${bookNames[params.slug] || params.slug} مع الترتيب والتصفح السهل.`;

    return { title, description };
}

export default function Page({ params }) {
    return <HadithBook slug={params.slug} />;
}
