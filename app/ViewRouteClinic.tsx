import React, { useState, useEffect } from "react";
import { View, StyleSheet, Linking, ScrollView } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import DropOffModal from "@/components/DropOffModal"; // Adjust if path is different
import * as Location from "expo-location";
import { fetchClinicsByRouteAndDate } from '../backend/api'; // adjust path



const ViewRouteClinic = ({ clinicdata }: { clinicdata: any }) => {
  const {route_id, date, routeName } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const loadData = async () => {
      if (clinicdata && Array.isArray(clinicdata) && clinicdata.length > 0) {
        setClinics(clinicdata);
        setLoading(false);
      } else if (route_id && date) {
        try {
          const data = await fetchClinicsByRouteAndDate(route_id as string, date as string);
          setClinics(data);
        } catch (err) {
          console.error("Failed to fetch clinics", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [route_id, date, clinicdata]);

 

  const handlePickUp = async (clinic: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };

      setSelectedClinic({ ...clinic, pickupLocation: currentCoords });
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Unable to fetch location");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {loading ? (
          <Text>Loading clinics...</Text>
        ) : clinics.length === 0 ? (
          <Text>No clinics found for this route and date.</Text>
        ) : (
          clinics.map((clinic, idx) => {
            const name = clinic?.clinicData?.clinic_name || "";
            const address1 = clinic?.clinicData?.clinic_address1 || "";
            const city = clinic?.clinicData?.clinic_city || "";
            const fullAddress = `${address1}, ${city}`;
            const addressLink = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
            const routeName1 = clinic?.route?.route_name ||routeName;
            const sheetDate = clinic?.sheetDate || date;

            return (
              <Card
                key={idx}
                style={[styles.card, clinic.highlighted && styles.highlight]}
              >
                <Card.Content>
                  <View style={styles.headerRow}>
                    <Text>Route: {routeName1}</Text>
                    <Text>{sheetDate}</Text>
                  </View>

                  <Text style={styles.clinicName}>Clinic: {name}</Text>

                  <Text
                    style={styles.clinicAddress}
                    onPress={() => Linking.openURL(addressLink)}
                  >
                    Clinic Address:{" "}
                    <Text style={styles.link}>{fullAddress}</Text>
                  </Text>

                  <Button
                    mode="outlined"
                    textColor="#f5a100"
                    style={styles.pickUpButton}
                    onPress={() => handlePickUp(clinic)}
                  >
                    PickUp
                  </Button>
                </Card.Content>
              </Card>
            );
          })
        )}

        <DropOffModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          clinic={selectedClinic}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f6f8fa",
    flex: 1,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  highlight: {
    backgroundColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clinicName: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#c11d1d",
    fontSize: 16,
  },
  clinicAddress: {
    marginTop: 4,
    marginBottom: 10,
    color: "#c11d1d",
  },
  link: {
    color: "#007aff",
    textDecorationLine: "underline",
  },
  pickUpButton: {
    alignSelf: "flex-end",
    borderColor: "#f5a100",
  },
});

export default ViewRouteClinic;
