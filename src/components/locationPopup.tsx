// src/components/LocationPermissionModal.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

const LocationPermissionModal = ({ onClose }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkPermission();
    console.log(status, "status in here")
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setStatus(status);

    if (status === "granted") {
      onClose();
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setStatus(status);

    if (status === "granted") {
      onClose();
    }
  };

  const openSettings = () => {
    Location.openAppSettings();
  };

  return (
    <Modal transparent visible>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
      }}>
        <View style={{
          width: "80%",
          padding: 20,
          backgroundColor: "white",
          borderRadius: 10
        }}>

          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Allow Location Access
          </Text>

          <Text style={{ marginTop: 10 }}>
            We need your location to show food options near you.
          </Text>
       <Text>
  {status ? status : "chahat"}
</Text>

          {status === "denied" && (
            <TouchableOpacity 
              onPress={requestPermission}
              style={{ marginTop: 20, padding: 12, backgroundColor: "#000", borderRadius: 6 }}>
              <Text style={{ color: "white", textAlign: "center" }}>Try Again</Text>
            </TouchableOpacity>
          )}

          {status === "blocked" && (
            <TouchableOpacity 
              onPress={openSettings}
              style={{ marginTop: 20, padding: 12, backgroundColor: "red", borderRadius: 6 }}>
              <Text style={{ color: "white", textAlign: "center" }}>Open Settings</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;
