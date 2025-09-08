export async function fetchFuelData(forceRefresh = false) {
  const url = forceRefresh ? "/api/fuel?refresh=true" : "/api/fuel";
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch fuel data: ${res.status}`);
  }

  return res.json();
}
