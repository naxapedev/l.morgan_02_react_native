import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";

const labelMap: Record<string, string> = {
  boxes: "# Boxes*",
  bck: "# BCK*",
  other: "# OTHER*",
  h2o: "# H2O*",
  bags: "# BAGS*",
  totalWeight: "# Total Weight*",
  airBill: "# Air Bill*",
  flightNumber: "Flight Number*",
};

interface RenderTextInputsProps {
  fields: string[];
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const RenderTextInputs: React.FC<RenderTextInputsProps> = ({ fields, formData, setFormData }) =>
  fields.map((field: string) => (
    <TextInput
      key={field}
      label={labelMap[field] || field}
      keyboardType={["flightNumber"].includes(field) ? "default" : "numeric"}
      value={formData[field]}
      onChangeText={(val) =>
        setFormData((prev: any) => ({ ...prev, [field]: val }))
      }
      style={styles.input}
    />
  ));

const styles = StyleSheet.create({
  input: {
    marginVertical: 6,
  },
});
