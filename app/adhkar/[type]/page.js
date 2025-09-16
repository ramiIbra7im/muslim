// app/adhkar/[type]/page.js
import AzkarPage from "../AzkarPage";

// هذه دالة Server-side لإعداد Meta Data
export async function generateMetadata({ params }) {
    const { type } = params;
    const decodedType = decodeURIComponent(type || "");
    return {
        title: ` ${decodedType} - نسك المسلم`,
        description: `صفحة  ${decodedType} لموقع نسك المسلم، زاد الروح وطمأنينة القلب.`,
    };
}

export default function Page({ params }) {
    const { type } = params;
    return <AzkarPage type={type} />;
}
