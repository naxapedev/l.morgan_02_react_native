// api.ts
const BASE_URL = "http://192.168.1.48:3000";

export const fetchRoutes = async () => {
  const res = await fetch(`${BASE_URL}/api/filtered-routes`);
  if (!res.ok) throw new Error("Failed to fetch routes");
  return res.json();
};

export const fetchClinicsByRouteAndDate = async (route_id: string, date: string) => {
  const res = await fetch(`${BASE_URL}/api/view-route-clinics?route_id=${route_id}&date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch clinics");
  return res.json();
};

// api.ts
export const upsertRouteDropoff = async (
  route_name: string,
  date: string,
  data: Record<string, any>
) => {
  const res = await fetch(`${BASE_URL}/api/routesheetdropoff-upsert?route_name=${route_name}&date=${date}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit drop-off info");
  }

  return res.json();
};


// backend/api.js
export const upsertRouteSheetDate = async (
  // route_id: string,
  payload: Record<string, any>
) => {
  try {
    const url = `${BASE_URL}/api/routesheetdate-upsert?`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // <-- Log actual backend message
      console.error("API Response Error:", response.status, errorBody);
      throw new Error("Failed to upsert route sheet date");
    }

    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};
