import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Button, RadioButton, Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

type Clinic = {
  name: string;
  address: string;
  addressLink: string;
  highlighted?: boolean;
};

type DropOffModalProps = {
  visible: boolean;
  onClose: () => void;
  clinic: Clinic | null;
};
const DropOffModal: React.FC<DropOffModalProps> = ({
  visible,
  onClose,
  clinic,
}) => {
  const [pickupFrom, setPickupFrom] = useState("Key Entry");
  const [supplies, setSupplies] = useState("Yes");
  const [checkLockbox, setCheckLockbox] = useState("Yes");
  const [pickupTime, setPickupTime] = useState("");

  const [labStaffName, setLabStaffName] = useState("");
  const [checkLockboxCheckbox, setCheckLockboxCheckbox] = useState(false);

  const showRadioLockbox = pickupFrom === "Key Entry";
  const showCheckboxLockbox =
    pickupFrom === "Lab Staff" || pickupFrom === "Lockbox";
  const showLabStaffInput = pickupFrom === "Lab Staff";
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = formatAMPM(hours, minutes);
    setPickupTime(formattedTime);
  }, []);

  const formatAMPM = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    const min = minutes < 10 ? `0${minutes}` : minutes;
    return `${hr}:${min} ${ampm}`;
  };
  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted || !cameraResult.granted) {
      Alert.alert(
        "Permission required",
        "Please grant camera and media library permissions"
      );
      return;
    }

    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });
            if (!result.canceled) {
              console.log("Image from camera:", result.assets[0].uri);
              // handle result.assets[0].uri
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
              console.log("Image from gallery:", result.assets[0].uri);
              // handle result.assets[0].uri
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            
            <Text style={styles.title}>Upload Proofs</Text>

            <Text style={styles.label}>Pickup Time</Text>
            <TextInput
              style={styles.input}
              value={pickupTime}
              editable={false}
            />

            <Text style={styles.label}>Room Temp</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Refrigerated Temp</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
            />

            {["HH", "BCK", "Other", "H2O"].map((label) => (
              <View key={label}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            ))}

            <Text style={styles.label}>Pickup From:</Text>
            <RadioButton.Group onValueChange={setPickupFrom} value={pickupFrom}>
              <View style={styles.radioRow}>
                <RadioButton value="Key Entry" />
                <Text>Key Entry</Text>
                <RadioButton value="Lockbox" />
                <Text>Lockbox</Text>
                <RadioButton value="Lab Staff" />
                <Text>Lab Staff</Text>
              </View>
            </RadioButton.Group>

            {showLabStaffInput && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.label}>Lab Staff Name:</Text>
                <TextInput
                  style={styles.input}
                  value={labStaffName}
                  onChangeText={setLabStaffName}
                  placeholder="Enter Lab Staff Name"
                />
              </View>
            )}

            <Text style={styles.label}>Supplies:</Text>
            <RadioButton.Group onValueChange={setSupplies} value={supplies}>
              <View style={styles.radioRow}>
                <RadioButton value="Yes" />
                <Text>Yes</Text>
                <RadioButton value="No" />
                <Text>No</Text>
              </View>
            </RadioButton.Group>

            <Text style={styles.label}>Check Lockbox:</Text>
            {showRadioLockbox && (
              <RadioButton.Group
                onValueChange={setCheckLockbox}
                value={checkLockbox}
              >
                <View style={styles.radioRow}>
                  <RadioButton value="Yes" />
                  <Text>Yes </Text>
                  <RadioButton value="No Lockbox" />
                  <Text>No Lockbox</Text>
                </View>
              </RadioButton.Group>
            )}

            {showCheckboxLockbox && (
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={checkLockboxCheckbox ? "checked" : "unchecked"}
                  onPress={() => setCheckLockboxCheckbox(!checkLockboxCheckbox)}
                />
                <Text>Yes</Text>
              </View>
            )}

            <Button
              mode="outlined"
              style={{ marginVertical: 10 }}
              onPress={handleImagePick}
            >
              Upload Photo
            </Button>

            <Button
              mode="contained"
              buttonColor="green"
              style={{ marginBottom: 10 }}
            >
              PickUp
            </Button>

            <Button mode="contained" buttonColor="red" onPress={onClose}>
              Close
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    maxHeight: "95%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
    textAlignVertical: "top",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
});

export default DropOffModal;
