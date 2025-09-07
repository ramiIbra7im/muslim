import { useState, useEffect, useRef } from "react";

export default function LocationSearch({ onSelectCity }) {
    const [manualCity, setManualCity] = useState("");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const debounceRef = useRef(null);

    const fetchCitySuggestions = async (query) => {
        if (!query || query.length < 2) {
            setCitySuggestions([]);
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            query
        )}&type=city&lang=ar&limit=5&apiKey=${apiKey}`;

        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        const suggestions = data.features || [];
        setCitySuggestions(
            suggestions.map((f) => ({
                city: f.properties.city || f.properties.name,
                country: f.properties.country,
            }))
        );
    };

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchCitySuggestions(manualCity);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [manualCity]);

    return (
        <div className="mb-3 position-relative col-10 m-auto">
            <input
                type="text"
                className="form-control shadow-sm rounded-pill px-3 py-2"
                style={{ fontSize: "1rem", direction: "rtl" }}
                placeholder="ابحث عن مدينتك..."
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
            />
            {citySuggestions.length > 0 && (
                <ul
                    className="list-group position-absolute w-100 mt-1 shadow rounded"
                    style={{
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                        direction: "rtl",
                    }}
                >
                    {citySuggestions.map((item, i) => (
                        <li
                            key={i}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: "pointer", fontSize: "0.95rem" }}
                            onClick={() => {
                                setManualCity(item.city);
                                setCitySuggestions([]);
                                onSelectCity(item.city, item.country);
                            }}
                        >
                            <strong>{item.city}</strong> - {item.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
