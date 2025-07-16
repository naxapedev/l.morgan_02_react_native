import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, Alert } from "react-native";
import { fetchRoutes } from "../../backend/api";
import { RouteCard } from "../../components/RouteCard";

const Routes = () => {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);


    type RouteItem = {
    route: {
      route_name: string;
      route_id: string;
    };
    sheetDate: string;
  };

  
// console.log(route_id );
  useEffect(() => {
    const getRoutes = async () => {
      try {
        const data = await fetchRoutes();
        setRoutes(data);
      } catch (err) {
        console.error("Failed to load routes:", err);
        Alert.alert("Error", "Could not fetch routes.");
      } finally {
        setLoading(false);
      }
    };

    getRoutes();
  }, []);
  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;
  return (
    <ScrollView style={{ padding: 10, marginTop: "10%" }}>
      {routes.map((item, index) => (
        <RouteCard
          key={index}
          routeName={item.route.route_name}
          date={item.sheetDate}
          route_id={item.route.route_id}
        />
      ))}
    </ScrollView>
  );
};

export default Routes;
