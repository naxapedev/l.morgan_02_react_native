import React, { useState, FC  } from "react";
import { View, Alert } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { PopupModal } from "./PopupModal";


interface RouteCardProps {
  routeName: string;
  date: string;
  route_id: string;
}

export const RouteCard: FC<RouteCardProps> = ({ routeName, date, route_id }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [dropOffType, setDropOffType] = useState("Lab");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [userLocation, setUserLocation] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    bags: "", boxes: "", bck: "", other: "", h2o: "",
    totalWeight: "", airBill: "", airline: "", flightNumber: "",
  });

  const handleSubmitDropOff = () => {
    console.log({ routeName, dropOffType, formData, userLocation });
    setModalVisible(false);
  };

  const handleUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted || !cameraResult.granted) {
      Alert.alert("Permission required", "Please grant permissions");
      return;
    }

    Alert.alert("Upload Image", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled) {
            console.log("Camera Image:", result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled) {
            console.log("Gallery Image:", result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDropOffClick = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setModalVisible(true);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch location");
      console.error(err);
    }
  };

  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Card style={{ marginBottom: 15 }}>
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Route: {routeName}</Text>
          <Text>{date}</Text>
        </View>
        <Text variant="headlineSmall" style={{ marginTop: 10, fontWeight: "bold" }}>
          {dayName}
        </Text>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 10, marginBottom: 20 }}>
          <Button
            mode="outlined"
            textColor="red"
            onPress={() =>
              router.push({
                pathname: "../ViewRouteClinic",
                params: { route_id, routeName, date, source: "myroutes" },
              })
            }
            style={{ borderColor: "red" }}
          >
            View
          </Button>
          <Button
            mode="outlined"
            textColor="green"
            onPress={handleDropOffClick}
            style={{ borderColor: "green" }}
          >
            Drop Off Info
          </Button>
          <Button
            mode="outlined"
            textColor="blue"
            onPress={() => console.log("Directions clicked")}
            style={{ borderColor: "blue" }}
          >
            Directions
          </Button>
        </View>
      </Card.Content>

      <PopupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        dropOffType={dropOffType}
        setDropOffType={setDropOffType}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmitDropOff}
        selectedAirline={selectedAirline}
        setSelectedAirline={setSelectedAirline}
        handleUploadImage={handleUploadImage}
      />
    </Card>
  );
};
