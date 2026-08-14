// src/components/LocationPermissionModal.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Linking, StyleSheet } from "react-native";
import * as Location from "expo-location";

interface LocationPermissionModalProps {
  onClose: () => void;
}

const LocationPermissionModal = ({ onClose }: LocationPermissionModalProps) => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    checkPermission();
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
    Linking.openSettings();
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>📍 Allow Location Access</Text>

          <Text style={styles.description}>
            We need your location to show food options near you.
          </Text>

          {status === "denied" && (
            <TouchableOpacity
              onPress={requestPermission}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}

          {status === "blocked" && (
            <TouchableOpacity
              onPress={openSettings}
              style={styles.settingsButton}>
              <Text style={styles.primaryButtonText}>Open Settings</Text>
            </TouchableOpacity>
          )}

          {status === "undetermined" && (
            <TouchableOpacity
              onPress={requestPermission}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Allow Access</Text>
            </TouchableOpacity>
          )}

          {/* Always show a skip button so the user can proceed */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "80%",
    padding: 24,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    width: "100%",
    padding: 14,
    backgroundColor: "#000",
    borderRadius: 8,
    marginBottom: 10,
  },
  settingsButton: {
    width: "100%",
    padding: 14,
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  skipButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
  },
  skipButtonText: {
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LocationPermissionModal;