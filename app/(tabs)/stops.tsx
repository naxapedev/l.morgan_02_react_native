import { ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import ViewRoutesClinic from '../ViewRouteClinic';
import { fetchRoutes } from '../../backend/api'; // adjust the path

const Stops = () => {
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await fetchRoutes();
        setClinics(data);
      } catch (err) {
        console.error("Failed to fetch clinics", err);
      }
    };

    fetchClinics();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ViewRoutesClinic clinicdata={clinics} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f8fa",
    marginTop: "10%",
  },
});

export default Stops;
