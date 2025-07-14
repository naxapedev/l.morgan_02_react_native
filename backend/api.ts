// api.ts
const BASE_URL = "http://192.168.1.7:3000";

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
