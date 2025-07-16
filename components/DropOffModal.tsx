// DropOffModal.tsx
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
import { upsertRouteSheetDate } from "../backend/api";

type DropOffModalProps = {
  visible: boolean;
  onClose: () => void;
  clinic: any; // use stricter type if needed
};

const DropOffModal: React.FC<DropOffModalProps> = ({
  visible,
  onClose,
  clinic,
}) => {
  const [pickupFrom, setPickupFrom] = useState("Key Entry");
  const [supplies, setSupplies] = useState("Yes");
  const [checkLockbox, setCheckLockbox] = useState("Yes");
  const [checkLockboxCheckbox, setCheckLockboxCheckbox] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
const [pickupTimeISO, setPickupTimeISO] = useState("");

  const [labStaffName, setLabStaffName] = useState("");
  const [roomTemp, setRoomTemp] = useState("");
  const [refrigeratedTemp, setRefrigeratedTemp] = useState("");
  const [hh, setHH] = useState("");
  const [bck, setBCK] = useState("");
  const [other, setOther] = useState("");
  const [h2o, setH2O] = useState("");
  const [comment, setComment] = useState("");
  const [photoUri, setPhotoUri] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const showRadioLockbox = pickupFrom === "Key Entry";
  const showCheckboxLockbox =
    pickupFrom === "Lab Staff" || pickupFrom === "Lockbox";
  const showLabStaffInput = pickupFrom === "Lab Staff";

  useEffect(() => {
    if (visible) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = formatAMPM(hours, minutes);
      setPickupTime(formattedTime);
      const isoTime = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    ).toISOString(); // e.g., 2025-07-16T10:00:00Z

    setPickupTimeISO(isoTime);
    }
  }, [visible]);

  const formatAMPM = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    const min = minutes < 10 ? `0${minutes}` : minutes;
    return `${hr}:${min} ${ampm}`;
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted || !cameraResult.granted) {
      Alert.alert("Permission required", "Please grant camera and media library permissions");
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
            setPhotoUri(result.assets[0].uri);
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
            setPhotoUri(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = async () => {
    // if (!clinic || !clinic.sheet_id) {
    //   Alert.alert("Error", "Missing route or clinic info");
    //   return;
    // }
// console.log(clinic.sheet_id)
    const payload = {
      sheet_id: clinic.sheet_id ,
      pickuptime: pickupTimeISO,
      photo: JSON.stringify(photoUri) || null,
      roomtemp: roomTemp,
      refrigeratedtemp: refrigeratedTemp,
      hh,
      bck,
      other,
      h2o,
      pickupfrom: pickupFrom,
      labstaff: showLabStaffInput ? labStaffName : null,
      supplies,
      checklock: showRadioLockbox ? checkLockbox : checkLockboxCheckbox,
      comment,
      pickuplocation: clinic.pickupLocation || null,
      timezone,
    };

    try {
      await upsertRouteSheetDate(payload);
      Alert.alert("Success", "Drop-off info submitted successfully");
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit drop-off info");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Drop-Off Info</Text>

            <Text style={styles.label}>Pickup Time</Text>
            <TextInput style={styles.input} value={pickupTime} editable={false} />

            <Text style={styles.label}>Room Temp</Text>
            <TextInput style={styles.input} value={roomTemp} onChangeText={setRoomTemp} keyboardType="numeric" />

            <Text style={styles.label}>Refrigerated Temp</Text>
            <TextInput style={styles.input} value={refrigeratedTemp} onChangeText={setRefrigeratedTemp} keyboardType="numeric" />

            <Text style={styles.label}>HH</Text>
            <TextInput style={styles.input} value={hh} onChangeText={setHH} keyboardType="numeric" />

            <Text style={styles.label}>BCK</Text>
            <TextInput style={styles.input} value={bck} onChangeText={setBCK} keyboardType="numeric" />

            <Text style={styles.label}>Other</Text>
            <TextInput style={styles.input} value={other} onChangeText={setOther} keyboardType="numeric" />

            <Text style={styles.label}>H2O</Text>
            <TextInput style={styles.input} value={h2o} onChangeText={setH2O} keyboardType="numeric" />

            <Text style={styles.label}>Pickup From</Text>
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
              <>
                <Text style={styles.label}>Lab Staff Name</Text>
                <TextInput
                  style={styles.input}
                  value={labStaffName}
                  onChangeText={setLabStaffName}
                  placeholder="Enter Lab Staff Name"
                />
              </>
            )}

            <Text style={styles.label}>Supplies</Text>
            <RadioButton.Group onValueChange={setSupplies} value={supplies}>
              <View style={styles.radioRow}>
                <RadioButton value="Yes" />
                <Text>Yes</Text>
                <RadioButton value="No" />
                <Text>No</Text>
              </View>
            </RadioButton.Group>

            <Text style={styles.label}>Check Lockbox</Text>
            {showRadioLockbox ? (
              <RadioButton.Group onValueChange={setCheckLockbox} value={checkLockbox}>
                <View style={styles.radioRow}>
                  <RadioButton value="Yes" />
                  <Text>Yes</Text>
                  <RadioButton value="No Lockbox" />
                  <Text>No Lockbox</Text>
                </View>
              </RadioButton.Group>
            ) : (
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={checkLockboxCheckbox ? "checked" : "unchecked"}
                  onPress={() => setCheckLockboxCheckbox(!checkLockboxCheckbox)}
                />
                <Text>Yes</Text>
              </View>
            )}

            <Text style={styles.label}>Comment</Text>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Any comments"
              multiline
            />

            <Button mode="outlined" style={{ marginVertical: 10 }} onPress={handleImagePick}>
              Upload Photo
            </Button>

            <Button mode="contained" buttonColor="green" style={{ marginBottom: 10 }} onPress={handleSubmit}>
              Submit Pickup
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
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default DropOffModal;
