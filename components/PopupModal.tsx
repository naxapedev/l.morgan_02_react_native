import React from "react";
import { View, ScrollView, Modal, StyleSheet } from "react-native";
import { Card, Button, RadioButton, Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { RenderTextInputs } from "./RenderTextInputs";

const dropOffOptions = ["Lab", "Transfer", "WareHouse", "FedEX", "Airport"];
const commonFields = ["bags", "boxes", "bck", "other", "h2o"];
const fedexFields = ["boxes", "totalWeight", "airBill"];
const airportFields = ["flightNumber", "boxes", "totalWeight", "airBill"];
const airlineOptions = [
  { label: "Delta", value: "Delta" },
  { label: "American Airlines", value: "American Airlines" },
  { label: "Southwest", value: "Southwest" },
  { label: "United", value: "United" },
];


interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  dropOffType: string;
  setDropOffType: (type: string) => void;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSubmit: () => void;
  selectedAirline: string;
  setSelectedAirline: (airline: string) => void;
  handleUploadImage: (type: string) => void;
  date: String;
  routeName: String;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  onClose,
  dropOffType,
  setDropOffType,
  formData,
  setFormData,
  handleSubmit,
  selectedAirline,
  setSelectedAirline,
  handleUploadImage,
  
}) => (
  
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <Card style={styles.modalCard}>
        <Card.Title title="Drop Off Info" />
        <ScrollView>
          <Card.Content>
            <RadioButton.Group onValueChange={setDropOffType} value={dropOffType}>
              {dropOffOptions.map((type) => (
                <RadioButton.Item key={type} label={type} value={type} />
              ))}
            </RadioButton.Group>

            {["Lab", "Transfer", "WareHouse"].includes(dropOffType) && (
              <RenderTextInputs
                fields={commonFields}
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {dropOffType === "FedEX" && (
              <>
                <RenderTextInputs fields={fedexFields} formData={formData} setFormData={setFormData} />
                <Button icon="camera" mode="outlined" onPress={() => handleUploadImage("fedex")} style={styles.uploadButton}>
                  Upload Receipt Images
                </Button>
              </>
            )}

            {dropOffType === "Airport" && (
              <>
                <Text variant="labelLarge" style={{ marginBottom: 4 }}>
                  Airline*
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#999" }}
                  selectedTextStyle={{ color: "#000" }}
                  data={airlineOptions}
                  maxHeight={200}
                  search
                  searchPlaceholder="Search..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Airline"
                  value={selectedAirline}
                  onChange={(item) => {
                    setSelectedAirline(item.value);
                    setFormData((prev) => ({ ...prev, airline: item.value }));
                  }}
                />
                <RenderTextInputs fields={airportFields} formData={formData} setFormData={setFormData} />
                <Button icon="camera" mode="outlined" onPress={() => handleUploadImage("airport")} style={styles.uploadButton}>
                  Upload Receipt Images
                </Button>
              </>
            )}

            <Button mode="contained" buttonColor="orange" onPress={handleSubmit}>Submit</Button>
            <Button mode="contained" buttonColor="red" onPress={onClose} style={{ marginTop: 8 }}>Close</Button>
          </Card.Content>
        </ScrollView>
      </Card>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    maxHeight: "95%",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  uploadButton: {
    marginTop: 10,
    marginBottom: 10,
  },
});
