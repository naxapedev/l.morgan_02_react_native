import { Tabs } from "expo-router";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >

      <Tabs.Screen
        name="willcalls"
        options={{
          title: "Willcalls",
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: "My Routes",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="routes" size={20} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stops"
        options={{
          title: "Stops",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="sign-direction"
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={18} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
                    href: null,

          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
