export async function fetchForecastData() {
  try {
    const res = await fetch("/api/forecast", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch forecast data");
    const data = await res.json();

    return data.sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (err) {
    console.error("Error fetching forecast data:", err);
    return [];
  }
}
