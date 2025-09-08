export const dynamic = "force-dynamic";

let cachedData: { levelData: any[]; changeData: any[] } | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 day cache

export async function GET() {
  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(
      "https://api.data.gov.my/data-catalogue?id=fuelprice",
      { cache: "no-store" }
    );

    if (res.status === 429) {
      console.warn("Rate limited by API, returning cached data if available");
      return new Response(JSON.stringify(cachedData || { levelData: [], changeData: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch fuel data: ${res.status}`);
    }

    const data = await res.json();

    const levelData = data
      .filter((d: any) => d.series_type === "level")
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const changeData = data
      .filter((d: any) => d.series_type === "change_weekly")
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    cachedData = { levelData, changeData };
    lastFetchTime = now;

    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching fuel data:", error);
    return new Response(JSON.stringify({ levelData: [], changeData: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}