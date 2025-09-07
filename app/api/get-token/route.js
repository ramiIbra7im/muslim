export async function GET() {
    try {
        const OAUTH2_URL = "https://prelive-oauth2.quran.foundation/token";
        const CLIENT_ID = "c9c6a648-a41d-42b2-9631-b022cb9651d1";
        const CLIENT_SECRET = "iKmu.vRrgms3K75Unx7QJDJtf2";

        // تجهيز بيانات الـ POST
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", CLIENT_ID);
        params.append("client_secret", CLIENT_SECRET);

        // طلب التوكن
        const response = await fetch(OAUTH2_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });

        if (!response.ok) throw new Error("فشل الحصول على التوكن");

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
