import AzkarPage from "../AzkarPage";

export default function Page({ params }) {
    const { type } = params; // type من الرابط مثل sleep أو sabah
    return <AzkarPage type={type} />;
}
