import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = () => {
  return (
    
    <ScrollView style={styles.container}>
      
      {/* Top bar with marquee */}
      <View style={styles.topBar}>
        <InfiniteMarquee text="f hope pick-up at 10:30 alert: John Doe – 123 Main St – Be ready!" />
      </View>

      {/* Grid Cards */}
      <View style={styles.grid}>
        
        <DashboardCard icon="map" label="Todays Routes" />
        <DashboardCard icon="map-marker-plus" label="Stops" />
        <DashboardCard icon="package-variant" label="WillCalls" />
        <DashboardCard
          icon="counter"
          label="Total Mileage"
          description="Today's Miles"
        />
        <StatusCard />
      </View>
    </ScrollView>
  );
};

// Infinite Marquee Component
const InfiniteMarquee = ({ text }: { text: string }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0) return;

    const animate = () => {
      animatedValue.setValue(screenWidth);
      Animated.timing(animatedValue, {
        toValue: -textWidth,
        duration: ((screenWidth + textWidth) / 60) * 1000, // 60 px/sec speed
        useNativeDriver: true,
      }).start(() => {
        animate(); // loop infinitely
      });
    };

    animate();
  }, [textWidth]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.Text
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        style={[
          styles.marqueeText,
          { transform: [{ translateX: animatedValue }] },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const DashboardCard = ({ icon, label, description = "", color = "#333" }: {
  icon: string;
  label: string;
  description?: string;
  color?: string;
}) => (
  <Card style={styles.card} mode="outlined">
    <Card.Content style={styles.cardContent}>
      <Icon name={icon} size={30} color={color} />
      <Text style={styles.label}>{label}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </Card.Content>
  </Card>
);

const StatusCard = () => (
  <Card style={styles.statusCard} mode="outlined">
    <Card.Content style={{ flexDirection: "row" }}>
      {/* Left: Status List */}
      <View style={{ flex: 1 }}>
        <Text variant="titleSmall" style={{ marginBottom: 8 }}>
          Elid’s status
        </Text>
        {[
          "Wait Elid",
          "No-Pickup",
          "Wait Elid",
          "Toll",
          "Re-attempt",
          "Wait Elid",
        ].map((item, idx) => (
          <Text key={idx} style={styles.statusItem}>
            {item.padEnd(15, "_")}pending  
          </Text>
        ))}
      </View>

      {/* Right: 3 Icons in stacked boxes */}
      <View style={styles.iconColumn}>
        <View style={styles.iconBox}>
          <Icon name="cellphone-marker" size={24} />
        </View>
        <View style={styles.iconBox}>
          <Icon name="map-marker" size={24} />
        </View>
        <View style={styles.iconBox}>
          <Icon name="headset" size={24} />
        </View>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: "10%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 6,
  },
  marqueeContainer: {
    overflow: "hidden",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // marginRight: 10,
  },
  marqueeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FAF9F6",
    marginBottom: 12,
    borderRadius: 10,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    height: 130,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#FAF9F6",
    width: "100%",
    borderRadius: 10,
    marginTop: 5,
  },
  statusItem: {
    fontSize: 13,
    marginVertical: 2,
  },
  iconColumn: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default DashboardScreen;
